import psycopg2
import psycopg2.extras
from config import DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD

con = psycopg2.connect(host=DB_HOST, database=DB_NAME,
                       user=DB_USERNAME, password=DB_PASSWORD)
cur = con.cursor(cursor_factory=psycopg2.extras.DictCursor)


def process_query(data):
    keys = [c[0] for c in cur.description]
    end_data = []
    for row in data:
        dict_row = dict.fromkeys(keys)
        for r, k in zip(row, keys):
            dict_row[k] = r
        end_data.append(dict_row)
    return end_data


def targets_sql():
    query = "select * from targets;"
    cur.execute(query)
    return process_query(cur.fetchall())


def targets_id_sql(t_id):
    query = "select * from targets where id = '{0}';".format(t_id)
    cur.execute(query)
    return process_query(cur.fetchall())


def users_sql():
    query = "select * from users;"
    cur.execute(query)
    return process_query(cur.fetchall())
