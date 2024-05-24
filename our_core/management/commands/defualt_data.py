import os
import psycopg2  # Replace with your database driver if using a different database
from django.core.management.base import BaseCommand
from django.core.management.templates import TemplateCommand

def populate_database_from_sql(sql_file_path, database_name, username, password, host_or_ip="localhost", port=5432,schema_name="public"):
    """
    Populates a database with initial data from an SQL file.

    Args:
        sql_file_path (str): Path to the SQL file containing the initial data.
        database_name (str): Name of the database to populate.
        username (str): Database username with access privileges.
        password (str): Database password for the provided username.
        host_or_ip (str, optional): Hostname or IP address of the database server. Defaults to 'localhost'.
        port (int, optional): Database server port. Defaults to 5432.

    Raises:
        FileNotFoundError: If the specified SQL file is not found.
        psycopg2.OperationalError: If an error occurs during database connection or query execution.
    """

    if not os.path.exists(sql_file_path):
        raise FileNotFoundError(f"SQL file not found: {sql_file_path}")

    # Establish a database connection
    try:
        connection = psycopg2.connect(
            database=database_name, user=username, password=password, host=host_or_ip, port=port
        )
    except psycopg2.OperationalError as e:
        raise e

    # Create a cursor for executing SQL statements
    cursor = connection.cursor()
    # Read the SQL file contents
    with open(sql_file_path, 'r',encoding='utf-8') as sql_file:
        sql_data = sql_file.read()
    for statement in sql_data.splitlines():
        statement = statement.strip()  # Remove leading/trailing whitespace
        if not statement:  # Skip empty lines
            continue
        
        cursor.execute("SET CONSTRAINTS ALL DEFERRED")
        cursor.execute(statement.replace("public.",schema_name+"."))
        cursor.execute("SET CONSTRAINTS ALL IMMEDIATE")

    # Commit changes to the database
    connection.commit()

    # Close the database connection
    connection.close()



class Command(BaseCommand):

    
    def add_arguments(self, parser):
        parser.add_argument('schema_name', type=str, help='The target app_name')        

    def handle(self, **options):
        schema_name = options['schema_name']
        Engine="tenant_schemas.postgresql_backend"
        User="admin_oaks"
        password="g4rT3MsSvjMaPuMMrMLLgWBtKwMABj"
        Host="localhost" 
        PORT= "5432"
        print("os"*10)
        if schema_name:
            print(schema_name)
            populate_database_from_sql( os.path.join(os.path.dirname(__file__), "data_init\data.sql"),"db_2024",User,password,Host,PORT,schema_name)