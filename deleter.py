import pandas as pd
import os

# =========================
# 🔥 ABSOLUTE PATH SETUP
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_DATA_DIR = os.path.join(BASE_DIR, "UserData")
ML_DATA_DIR = os.path.join(USER_DATA_DIR, "ML_Data")
SUMMARIES_DIR = os.path.join(USER_DATA_DIR, "Summaries")
MAP_DIR = os.path.join(USER_DATA_DIR, "map")

# Master files
ORD_FILE = os.path.join(ML_DATA_DIR, "ord_combine.csv")
COMBINED_FILE = os.path.join(ML_DATA_DIR, "combined.csv")
MAP_FILE = os.path.join(MAP_DIR, "user_mapping.csv")


def purge_user_data(target_id):
    print(f"\n🚀 Initiating deletion protocol for User {target_id}...")

    # =======================================================
    # 1. Delete individual user metric files across all folders
    # =======================================================
    files_to_delete = [
        os.path.join(USER_DATA_DIR, f"keystroke_data_User_{target_id}.csv"),
        os.path.join(USER_DATA_DIR, f"HandSize_User_{target_id}.csv"),
        os.path.join(SUMMARIES_DIR, f"session_summary_User_{target_id}.csv")
    ]

    for file_path in files_to_delete:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"✅ Deleted local file: {file_path}")
        else:
            print(f"⚠️ File not found (skipping): {file_path}")

    # =======================================================
    # 2. Remove user from the Mapper File
    # =======================================================
    if os.path.exists(MAP_FILE):
        try:
            df_map = pd.read_csv(MAP_FILE)
            if target_id in df_map['UserID'].values:
                df_map = df_map[df_map['UserID'] != target_id]
                df_map.to_csv(MAP_FILE, index=False)
                print(f"✅ Removed User {target_id} from {MAP_FILE}")
            else:
                print(f"⚠️ User {target_id} not found in Mapper file.")
        except Exception as e:
            print(f"❌ Error processing map file: {e}")

    # =======================================================
    # 3. Purge from Master Databases inside ML_Data/
    # =======================================================
    if os.path.exists(ORD_FILE):
        try:
            # Read the ordered dataset, skipping corrupted lines if any exist
            df_ord = pd.read_csv(ORD_FILE, on_bad_lines='skip')

            # Check if user exists in the master dataset
            if target_id in df_ord['ID'].values:
                initial_rows = len(df_ord)

                # Drop all rows belonging to the target user
                df_ord = df_ord[df_ord['ID'] != target_id]
                deleted_rows = initial_rows - len(df_ord)

                # Save the scrubbed ordered dataset
                df_ord.to_csv(ORD_FILE, index=False)
                print(f"✅ Removed {deleted_rows} keystrokes belonging to User {target_id} from ord_combine.csv")

                # 4. Rebuild combined.csv from scratch
                # This guarantees no orphaned anonymous data is left behind
                if not df_ord.empty:
                    df_combined = df_ord.drop(columns=['ID']).copy()
                    df_combined.insert(0, 'SL.no.', range(1, len(df_combined) + 1))
                    df_combined.to_csv(COMBINED_FILE, index=False)
                    print(f"✅ Rebuilt combined.csv successfully. All traces eliminated.")
                else:
                    # If deleting this user empties the entire database
                    if os.path.exists(COMBINED_FILE):
                        os.remove(COMBINED_FILE)
                    print(f"⚠️ ord_combine.csv is now empty. combined.csv has been deleted.")

            else:
                print(f"⚠️ User {target_id} not found inside ord_combine.csv. No database rows deleted.")

        except Exception as e:
            print(f"❌ Error processing databases: {e}")
    else:
        print(f"⚠️ Master database '{ORD_FILE}' does not exist.")


if __name__ == "__main__":
    print("=" * 50)
    print("🧹 KEYSTROKE DATABASE CLEANER")
    print("=" * 50)

    user_input = input(">> Enter the User ID you want to completely delete: ").strip()

    if user_input.isdigit():
        target_id = int(user_input)

        # Safety catch to prevent accidental wipes
        confirm = input(
            f"⚠️ WARNING: This will permanently delete all data for User {target_id}. Type 'y' to confirm: ").strip().lower()

        if confirm == 'y':
            purge_user_data(target_id)
            print("\n✅ Deletion complete.")
        else:
            print("❌ Deletion cancelled.")
    else:
        print("❌ Invalid ID. Please enter a number.")