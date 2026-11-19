public class MatrixScannerApp {
    public static void main(String[] args) {
        int[][] sensorGrid = {
            { 10,  12,  14,  15 },
            { 18,  99,  22,  24 },
            { 30,  32,  34,  36 }
        };

        int anomalyTarget = 99;
        boolean anomalyFound = false;
        int targetRow = -1;
        int targetCol = -1;

        System.out.println("==============================================");
        System.out.println("        SATELLITE SENSOR GRID AUDIT           ");
        System.out.println("==============================================");

        gridScanner:
        for (int r = 0; r < sensorGrid.length; r++) {
            for (int c = 0; c < sensorGrid[r].length; c++) {
                int reading = sensorGrid[r][c];
                System.out.printf("Scanning cell [%d][%d] -> Value: %d%n", r, c, reading);

                if (reading == anomalyTarget) {
                    anomalyFound = true;
                    targetRow = r;
                    targetCol = c;
                    System.out.println(">> ANOMALY IDENTIFIED! Terminating full grid scan.");
                    break gridScanner;
                }
            }
        }

        System.out.println("----------------------------------------------");
        if (anomalyFound) {
            System.out.printf("Scan Complete: Anomaly locked at Row %d, Column %d%n", targetRow, targetCol);
        } else {
            System.out.println("Scan Complete: All sensors within normal nominal range.");
        }
        System.out.println("==============================================");
    }
}
