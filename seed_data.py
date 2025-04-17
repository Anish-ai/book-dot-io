import psycopg2
import random
from datetime import datetime, timedelta
import string
import sys
import time

# Connection parameters
DB_PARAMS = {
    "dbname": "neondb",
    "user": "neondb_owner",
    "password": "npg_YXmIO4SD0jgo",
    "host": "ep-wandering-wildflower-a5cka4ar-pooler.us-east-2.aws.neon.tech",
    "port": "5432",
    "sslmode": "require"
}

def get_connection():
    """Create and return a database connection with retry logic"""
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            print(f"Attempting to connect to database (attempt {retry_count + 1})...")
            conn = psycopg2.connect(**DB_PARAMS)
            print("Connected successfully!")
            return conn
        except Exception as e:
            retry_count += 1
            print(f"Connection failed: {str(e)}")
            if retry_count < max_retries:
                wait_time = 2 ** retry_count  # Exponential backoff
                print(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print("Max retries reached. Could not connect to the database.")
                raise

def random_string(length=8):
    return ''.join(random.choices(string.ascii_letters, k=length))

def execute_query(conn, cursor, query, params=None):
    """Execute a query with error handling"""
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        conn.commit()
        return True
    except Exception as e:
        conn.rollback()
        print(f"Error executing query: {str(e)}")
        print(f"Query: {query}")
        if params:
            print(f"Params: {params}")
        return False

def create_tables(conn, cur):
    """Create all tables if they don't exist"""
    print("Creating tables if they don't exist...")
    
    # Create Building table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Building" (
        "buildingId" INTEGER PRIMARY KEY,
        "floors" INTEGER
    )
    ''')
    
    # Create Department table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Department" (
        "deptId" INTEGER PRIMARY KEY,
        "name" TEXT NOT NULL,
        "buildingId" INTEGER REFERENCES "Building"("buildingId")
    )
    ''')
    
    # Create Admin table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Admin" (
        "adminId" INTEGER PRIMARY KEY,
        "deptId" INTEGER REFERENCES "Department"("deptId"),
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL
    )
    ''')
    
    # Create User table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "User" (
        "userId" INTEGER PRIMARY KEY,
        "deptId" INTEGER REFERENCES "Department"("deptId"),
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL
    )
    ''')
    
    # Create Room table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Room" (
        "roomId" INTEGER PRIMARY KEY,
        "roomName" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL
    )
    ''')
    
    # Create Booking table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Booking" (
        "requestId" INTEGER PRIMARY KEY,
        "category" TEXT NOT NULL,
        "roomId" INTEGER REFERENCES "Room"("roomId"),
        "userId" INTEGER REFERENCES "User"("userId"),
        "status" TEXT NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "description" TEXT
    )
    ''')
    
    # Create Schedule table
    execute_query(conn, cur, '''
    CREATE TABLE IF NOT EXISTS "Schedule" (
        "id" SERIAL PRIMARY KEY,
        "requestId" INTEGER REFERENCES "Booking"("requestId"),
        "roomId" INTEGER REFERENCES "Room"("roomId"),
        "startTime" TIMESTAMP NOT NULL,
        "endTime" TIMESTAMP NOT NULL,
        "day" TEXT NOT NULL
    )
    ''')
    
    print("Tables created or already exist.")

def seed_buildings(conn, cur, n=5):
    print(f"Seeding {n} buildings...")
    for i in range(1, n + 1):
        success = execute_query(
            conn, cur,
            "INSERT INTO \"Building\" (\"buildingId\", floors) VALUES (%s, %s)",
            (i, random.randint(1, 10))
        )
        if not success:
            return False
    print("Buildings seeded successfully.")
    return True

def seed_departments(conn, cur, n=10):
    print(f"Seeding {n} departments...")
    for i in range(1, n + 1):
        building_id = random.randint(1, 5)
        success = execute_query(
            conn, cur,
            "INSERT INTO \"Department\" (\"deptId\", name, \"buildingId\") VALUES (%s, %s, %s)",
            (i, f'Department_{i}', building_id)
        )
        if not success:
            return False
    print("Departments seeded successfully.")
    return True

def seed_admins(conn, cur, n=10):
    print(f"Seeding {n} admins...")
    for i in range(1, n + 1):
        dept_id = random.randint(1, 10)
        email = f'admin{i}@example.com'
        password = random_string()
        success = execute_query(
            conn, cur,
            "INSERT INTO \"Admin\" (\"adminId\", \"deptId\", email, password) VALUES (%s, %s, %s, %s)",
            (i, dept_id, email, password)
        )
        if not success:
            return False
    print("Admins seeded successfully.")
    return True

def seed_users(conn, cur, n=20):
    print(f"Seeding {n} users...")
    for i in range(1, n + 1):
        dept_id = random.randint(1, 10)
        email = f'user{i}@example.com'
        password = random_string()
        success = execute_query(
            conn, cur,
            'INSERT INTO "User" ("userId", "deptId", email, password) VALUES (%s, %s, %s, %s)',
            (i, dept_id, email, password)
        )
        if not success:
            return False
    print("Users seeded successfully.")
    return True

def seed_rooms(conn, cur, n=10):
    print(f"Seeding {n} rooms...")
    for i in range(1, n + 1):
        name = f'Room_{i}'
        room_type = random.choice(['Lecture Hall', 'Lab', 'Meeting Room'])
        capacity = random.randint(10, 100)
        success = execute_query(
            conn, cur,
            "INSERT INTO \"Room\" (\"roomId\", \"roomName\", type, capacity) VALUES (%s, %s, %s, %s)",
            (i, name, room_type, capacity)
        )
        if not success:
            return False
    print("Rooms seeded successfully.")
    return True

def seed_bookings(conn, cur, n=15):
    print(f"Seeding {n} bookings...")
    for i in range(1, n + 1):
        room_id = random.randint(1, 10)
        user_id = random.randint(1, 20)
        category = random.choice(['EVENT', 'REGULAR', 'EXTRA', 'LABS'])
        status = random.choice(['PENDING', 'APPROVED', 'REJECTED'])
        start_date = datetime.now() + timedelta(days=random.randint(1, 10))
        end_date = start_date + timedelta(hours=2)
        description = f'Description_{i}'
        success = execute_query(
            conn, cur,
            """INSERT INTO "Booking" ("requestId", category, "roomId", "userId", status, "startDate", "endDate", description)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (i, category, room_id, user_id, status, start_date, end_date, description)
        )
        if not success:
            return False
    print("Bookings seeded successfully.")
    return True

def seed_schedules(conn, cur, n=20):
    print(f"Seeding {n} schedules...")
    for i in range(1, n + 1):
        request_id = random.randint(1, 15)
        room_id = random.randint(1, 10)
        start_time = datetime.now() + timedelta(hours=random.randint(1, 48))
        end_time = start_time + timedelta(hours=1)
        day = random.choice(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
        success = execute_query(
            conn, cur,
            """INSERT INTO "Schedule" (id, "requestId", "roomId", "startTime", "endTime", day)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (i, request_id, room_id, start_time, end_time, day)
        )
        if not success:
            return False
    print("Schedules seeded successfully.")
    return True

def run_all():
    print("Starting database seeding process...")
    
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # Create tables
        create_tables(conn, cur)
        
        # Seed data in order of dependencies
        steps = [
            lambda: seed_buildings(conn, cur),
            lambda: seed_departments(conn, cur),
            lambda: seed_admins(conn, cur),
            lambda: seed_users(conn, cur),
            lambda: seed_rooms(conn, cur),
            lambda: seed_bookings(conn, cur),
            lambda: seed_schedules(conn, cur)
        ]
        
        for step_func in steps:
            if not step_func():
                print("Seeding process failed. Exiting.")
                return False
                
        print("\nSeeding complete! All data has been loaded successfully.")
        return True
    
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
        return False
    finally:
        if 'cur' in locals():
        cur.close()
        if 'conn' in locals():
        conn.close()
            print("Database connection closed.")

if __name__ == '__main__':
    print("Seed script starting...")
    success = run_all()
    sys.exit(0 if success else 1)
