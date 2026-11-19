public class EmployeePayrollApp {

    // Base Employee
    public static class Employee {
        private final String employeeId;
        private final String name;
        protected final double baseSalary;

        public Employee(String employeeId, String name, double baseSalary) {
            this.employeeId = employeeId;
            this.name = name;
            this.baseSalary = baseSalary;
        }

        public double calculateMonthlyPay() {
            return baseSalary / 12.0;
        }

        public String getPaystub() {
            return String.format("[%s] %-14s | Monthly Pay: $%.2f",
                    employeeId, name, calculateMonthlyPay());
        }
    }

    // Salaried Manager with bonus compensation
    public static class Manager extends Employee {
        private final double annualBonus;

        public Manager(String id, String name, double baseSalary, double annualBonus) {
            super(id, name, baseSalary);
            this.annualBonus = annualBonus;
        }

        @Override
        public double calculateMonthlyPay() {
            // Overrides calculation: (base + bonus) / 12
            return (baseSalary + annualBonus) / 12.0;
        }
    }

    // Commissioned Sales Executive
    public static class CommissionedSales extends Employee {
        private double monthlySalesVolume;
        private final double commissionRatePercent;

        public CommissionedSales(String id, String name, double baseSalary, double commissionRatePercent) {
            super(id, name, baseSalary);
            this.commissionRatePercent = commissionRatePercent;
        }

        public void recordSale(double saleAmount) {
            this.monthlySalesVolume += saleAmount;
        }

        @Override
        public double calculateMonthlyPay() {
            double commission = monthlySalesVolume * (commissionRatePercent / 100.0);
            return (baseSalary / 12.0) + commission;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Corporate Payroll Processing System ===");

        Employee regular = new Employee("EMP-101", "David Miller", 60_000.0);
        Manager mgr = new Manager("MGR-201", "Sarah Connor", 120_000.0, 30_000.0);
        CommissionedSales sales = new CommissionedSales("SLS-301", "Alex Mercer", 48_000.0, 5.0);
        sales.recordSale(80_000.0); // Generated $4,000 commission

        System.out.println(regular.getPaystub());
        System.out.println(mgr.getPaystub());
        System.out.println(sales.getPaystub());
    }
}
