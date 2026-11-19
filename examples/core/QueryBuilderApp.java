import java.util.ArrayList;
import java.util.List;

public class QueryBuilderApp {

    public static class SQLQuery {
        private final String table;
        private final List<String> conditions = new ArrayList<>();
        private final List<Object> parameters = new ArrayList<>();
        private int limit = -1;

        public SQLQuery(String table) {
            this.table = table;
        }

        // Overload 1: Simple equality clause
        public SQLQuery where(String column, Object value) {
            conditions.add(column + " = ?");
            parameters.add(value);
            return this;
        }

        // Overload 2: Custom operator clause
        public SQLQuery where(String column, String operator, Object value) {
            conditions.add(column + " " + operator + " ?");
            parameters.add(value);
            return this;
        }

        // Overload 3: IN clause with varargs values
        public SQLQuery whereIn(String column, Object... values) {
            if (values == null || values.length == 0) {
                return this;
            }
            StringBuilder placeholders = new StringBuilder();
            for (int i = 0; i < values.length; i++) {
                placeholders.append(i == 0 ? "?" : ", ?");
                parameters.add(values[i]);
            }
            conditions.add(column + " IN (" + placeholders + ")");
            return this;
        }

        public SQLQuery limit(int maxRows) {
            this.limit = maxRows;
            return this;
        }

        public String build() {
            StringBuilder sql = new StringBuilder("SELECT * FROM ").append(table);
            if (!conditions.isEmpty()) {
                sql.append(" WHERE ");
                for (int i = 0; i < conditions.size(); i++) {
                    if (i > 0) sql.append(" AND ");
                    sql.append(conditions.get(i));
                }
            }
            if (limit > 0) {
                sql.append(" LIMIT ").append(limit);
            }
            return sql.toString();
        }

        public List<Object> getParameters() {
            return parameters;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Fluent Query Builder with Overloading & Varargs ===");

        SQLQuery query = new SQLQuery("users")
                .where("status", "ACTIVE")
                .where("age", ">=", 21)
                .whereIn("role", "ADMIN", "EDITOR", "AUDITOR")
                .limit(50);

        System.out.println("Generated SQL: " + query.build());
        System.out.println("Bound Parameters: " + query.getParameters());
    }
}
