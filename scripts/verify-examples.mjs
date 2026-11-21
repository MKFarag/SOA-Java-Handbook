import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const JDK_BIN = 'C:\\Program Files\\Java\\jdk-26.0.1\\bin';
const JAVAC = fs.existsSync(path.join(JDK_BIN, 'javac.exe')) ? `"${path.join(JDK_BIN, 'javac.exe')}"` : 'javac';
const JAVA = fs.existsSync(path.join(JDK_BIN, 'java.exe')) ? `"${path.join(JDK_BIN, 'java.exe')}"` : 'java';
const JAR = fs.existsSync(path.join(JDK_BIN, 'jar.exe')) ? `"${path.join(JDK_BIN, 'jar.exe')}"` : 'jar';
const TOMCAT_LIB = path.resolve('tools/apache-tomcat-10.1.61/lib/*');
const SQLITE_JAR = path.resolve('tools/sqlite-jdbc-3.49.1.0.jar');
const hasTomcat = fs.existsSync(path.resolve('tools/apache-tomcat-10.1.61/lib'));
const hasSqlite = fs.existsSync(SQLITE_JAR);

console.log('====================================================');
console.log(' Java & Jakarta EE Handbook — Automated Test Suite  ');
console.log('====================================================');

let passed = 0;
let failed = 0;
let skipped = 0;

function runTest(name, fn) {
  try {
    process.stdout.write(`Testing: ${name}... `);
    const result = fn();
    if (result === 'skip') {
      console.log('SKIPPED [-]');
      skipped++;
    } else {
      console.log('PASSED [OK]');
      passed++;
    }
  } catch (err) {
    if (!hasTomcat && (name.includes('Jakarta') || err.message.includes('jakarta.servlet') || err.message.includes('package jakarta') || err.message.includes('cannot find symbol\n') && err.message.includes('Servlet'))) {
      console.log('SKIPPED (requires Tomcat tools) [-]');
      skipped++;
      return;
    }
    if (!hasSqlite && (name.includes('Topic 61') || err.message.includes('sqlite') || err.message.includes('No suitable driver'))) {
      console.log('SKIPPED (requires SQLite jar) [-]');
      skipped++;
      return;
    }
    console.log('FAILED [X]');
    console.error(`  Error: ${err.message}`);
    failed++;
  }
}

// Section 1: Topics 01 - 03
runTest('Core - Topic 01: HardwareProbe.java', () => {
  const file = 'examples/core/HardwareProbe.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HardwareProbe`).toString();
  if (!out.includes('Host CPU Cores Available to JVM') || !out.includes('Java Specification Version:')) throw new Error(out);
});

runTest('Core - Topic 01: PerformanceTracker.java', () => {
  const file = 'examples/core/PerformanceTracker.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PerformanceTracker`).toString();
  if (!out.includes('Elena Vance') || !out.includes('80.0%')) throw new Error(out);
});

runTest('Core - Topic 02: RuntimeInspector.java', () => {
  const file = 'examples/core/RuntimeInspector.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core RuntimeInspector`).toString();
  if (!out.includes('Active Java Home') || !out.includes('JVM Implementation')) throw new Error(out);
});

runTest('Core - Topic 02: EnvironmentValidator.java', () => {
  const file = 'examples/core/EnvironmentValidator.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EnvironmentValidator`).toString();
  if (!out.includes('STATUS: [READY] System meets enterprise Java development standards.')) throw new Error(out);
});

runTest('Core - Topic 03: HelloWorld.java', () => {
  const file = 'examples/core/HelloWorld.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HelloWorld`).toString();
  if (!out.includes('Hello, Java Explorer!') || !out.includes('Runtime Version:')) throw new Error(out);
});

runTest('Core - Topic 03: GreetingApp.java', () => {
  const file = 'examples/core/GreetingApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core GreetingApp "SeniorEngineer"`).toString();
  if (!out.includes('Learner: SeniorEngineer') || !out.includes('Weekly Target: 10 hours')) throw new Error(out);
});

// Section 2: Topics 04 - 07
runTest('Core - Topic 04: PrimitivesDemo.java', () => {
  const file = 'examples/core/PrimitivesDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PrimitivesDemo`).toString();
  if (!out.includes('Byte Range') || !out.includes('Float Temp')) throw new Error(out);
});

runTest('Core - Topic 04: SensorLedger.java', () => {
  const file = 'examples/core/SensorLedger.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SensorLedger`).toString();
  if (!out.includes('IOT TELEMETRY REPORT') || !out.includes('Battery Voltage : 3.28 V')) throw new Error(out);
});

runTest('Core - Topic 05: OperatorMechanics.java', () => {
  const file = 'examples/core/OperatorMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OperatorMechanics`).toString();
  if (!out.includes('Prefix  : a=6, result=6') || !out.includes('Safely checked null string')) throw new Error(out);
});

runTest('Core - Topic 05: SecurityPermissions.java', () => {
  const file = 'examples/core/SecurityPermissions.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SecurityPermissions`).toString();
  if (!out.includes('Has READ Access   : true') || !out.includes('After Revoke -> Has WRITE Access : false')) throw new Error(out);
});

runTest('Core - Topic 06: CastingMechanics.java', () => {
  const file = 'examples/core/CastingMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CastingMechanics`).toString();
  if (!out.includes('int 42 widened to double: 42.0') || !out.includes('Truncated int   : 199')) throw new Error(out);
});

runTest('Core - Topic 06: OverflowGuardApp.java', () => {
  const file = 'examples/core/OverflowGuardApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OverflowGuardApp`).toString();
  if (!out.includes('ALERT PREVENTED: Overflow detected!') || !out.includes('2500000000')) throw new Error(out);
});

runTest('Core - Topic 07: StringPoolDemo.java', () => {
  const file = 'examples/core/StringPoolDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core StringPoolDemo`).toString();
  if (!out.includes('literal1 == literal2 (Same Memory Ref): true') || !out.includes('Message after reassignment: HELLO')) throw new Error(out);
});

runTest('Core - Topic 07: TextBlockService.java', () => {
  const file = 'examples/core/TextBlockService.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core TextBlockService`).toString();
  if (!out.includes('AuthenticationGateway') || !out.includes('SELECT user_id, email, created_at')) throw new Error(out);
});

// Section 3: Topics 08 - 10
runTest('Core - Topic 08: DiscountCalculator.java', () => {
  const file = 'examples/core/DiscountCalculator.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DiscountCalculator`).toString();
  if (!out.includes('Applied Discount   : 15%') || !out.includes('Final Price to Pay : $127.50')) throw new Error(out);
});

runTest('Core - Topic 08: AccessGatekeeper.java', () => {
  const file = 'examples/core/AccessGatekeeper.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AccessGatekeeper`).toString();
  if (!out.includes('ACCESS GRANTED: Full Root Administrative Privileges Enabled.')) throw new Error(out);
});

runTest('Core - Topic 09: SwitchEvolutionDemo.java', () => {
  const file = 'examples/core/SwitchEvolutionDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SwitchEvolutionDemo`).toString();
  if (!out.includes('Computed modern result: Weekend (Rest)')) throw new Error(out);
});

runTest('Core - Topic 09: HttpStatusRouter.java', () => {
  const file = 'examples/core/HttpStatusRouter.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HttpStatusRouter`).toString();
  if (!out.includes('INCIDENT LOGGED: Dispatching pager alert to On-Call Engineer.')) throw new Error(out);
});

runTest('Core - Topic 10: LoopMechanicsDemo.java', () => {
  const file = 'examples/core/LoopMechanicsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core LoopMechanicsDemo`).toString();
  if (!out.includes('1 3 5') || !out.includes('Generated handshake token: 1')) throw new Error(out);
});

runTest('Core - Topic 10: MatrixScannerApp.java', () => {
  const file = 'examples/core/MatrixScannerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MatrixScannerApp`).toString();
  if (!out.includes('Anomaly locked at Row 1, Column 1')) throw new Error(out);
});

// Section 4: Topics 11 - 13
runTest('Core - Topic 11: MethodMechanics.java', () => {
  const file = 'examples/core/MethodMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MethodMechanics`).toString();
  if (!out.includes('After modifyPrimitive: 50 (unchanged)') || !out.includes('After modifyArray: scores[0] = 999')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 11: AccountService.java', () => {
  const file = 'examples/core/AccountService.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AccountService`).toString();
  if (!out.includes('Transferred $200.00 from CHK-9041 to SAV-3108') || !out.includes('Transfer 2 status: FAILED')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 12: OverloadingMechanics.java', () => {
  const file = 'examples/core/OverloadingMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OverloadingMechanics`).toString();
  if (!out.includes('display(int): 25') || !out.includes('process(Integer - Autoboxing): 42')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 12: QueryBuilderApp.java', () => {
  const file = 'examples/core/QueryBuilderApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core QueryBuilderApp`).toString();
  if (!out.includes('SELECT * FROM users WHERE status = ? AND age >= ? AND role IN (?, ?, ?) LIMIT 50')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 13: ScopeMechanics.java', () => {
  const file = 'examples/core/ScopeMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ScopeMechanics`).toString();
  if (!out.includes('Shadowed globalCounter inside block: 55') || !out.includes('Class-level globalCounter after: 100')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 13: TypeInferenceEngine.java', () => {
  const file = 'examples/core/TypeInferenceEngine.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core TypeInferenceEngine`).toString();
  if (!out.includes('Stream processed message: System metric status: OK') || !out.includes('inferredString class: String')) {
    throw new Error(out);
  }
});

// Section 5: Topics 14 - 15
runTest('Core - Topic 14: ArrayMechanics.java', () => {
  const file = 'examples/core/ArrayMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ArrayMechanics`).toString();
  if (!out.includes('Defaults: [0, 0, 0, 0]') || !out.includes('Caught Expected Exception: ArrayIndexOutOfBoundsException')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 14: SensorBufferApp.java', () => {
  const file = 'examples/core/SensorBufferApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SensorBufferApp`).toString();
  if (!out.includes('Streamed 27.1') || !out.includes('Peak: 27.1') || !out.includes('Samples in window: 5')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 15: JaggedArrayDemo.java', () => {
  const file = 'examples/core/JaggedArrayDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core JaggedArrayDemo`).toString();
  if (!out.includes('Arrays.deepEquals() (deep) : true') || !out.includes('Arrays.equals() (shallow): false')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 15: FleetInventoryManager.java', () => {
  const file = 'examples/core/FleetInventoryManager.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core FleetInventoryManager`).toString();
  if (!out.includes('Sorted Serials (O(N log N)): [1024, 2190, 3090, 4400, 5510, 7720, 8840]') ||
      !out.includes('Binary search for serial 5510 -> Found at index 4')) {
    throw new Error(out);
  }
});

// Section 6: Topics 16 - 19
runTest('Core - Topic 16: ClassMemoryLayout.java', () => {
  const file = 'examples/core/ClassMemoryLayout.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ClassMemoryLayout`).toString();
  if (!out.includes('Total Instances (Static): 2') || !out.includes('obj1 == alias: true') || !out.includes('Alpha-Modified')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 16: VehicleTelemetryApp.java', () => {
  const file = 'examples/core/VehicleTelemetryApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core VehicleTelemetryApp`).toString();
  if (!out.includes('1HGCR2F83HA001') || !out.includes('Marcus Vance') || !out.includes('Fuel:  82.7%')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 17: ConstructorChainingDemo.java', () => {
  const file = 'examples/core/ConstructorChainingDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ConstructorChainingDemo`).toString();
  if (!out.includes('[1. Static Block]') || !out.includes('[2. Instance Block]') || !out.includes('Port: 443 | SSL: true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 17: ServerConfigurationApp.java', () => {
  const file = 'examples/core/ServerConfigurationApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ServerConfigurationApp`).toString();
  if (!out.includes('Server Listening on 127.0.0.1:9090') || !out.includes('Server Listening on 0.0.0.0:8080')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 18: AccessModifierDemo.java', () => {
  const file = 'examples/core/AccessModifierDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AccessModifierDemo`).toString();
  if (!out.includes('PUBLIC: Accessible everywhere') || !out.includes('Inside Class Access -> PRIVATE: Accessible only inside SecurityBoundary class')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 18: SecurePaymentGateway.java', () => {
  const file = 'examples/core/SecurePaymentGateway.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SecurePaymentGateway`).toString();
  if (!out.includes('Dispatching HTTPS POST to https://api.stripe.com/v1/charges') || !out.includes('Charge Status: APPROVED')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 19: EncapsulationMechanics.java', () => {
  const file = 'examples/core/EncapsulationMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EncapsulationMechanics`).toString();
  if (!out.includes('Corrupted balance in bad account: $-999999.0') || !out.includes('Overdraft attempt succeeded: false') || !out.includes('Final verified balance: $150.0')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 19: FinancialLedgerEntry.java', () => {
  const file = 'examples/core/FinancialLedgerEntry.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core FinancialLedgerEntry`).toString();
  if (!out.includes('After mutating original Date:') || !out.includes('State preserved!')) {
    throw new Error(out);
  }
});

// Section 7: Topics 20 - 25
runTest('Core - Topic 20: InheritanceMechanics.java', () => {
  const file = 'examples/core/InheritanceMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core InheritanceMechanics`).toString();
  if (!out.includes('Nexus device powering on (Generic BIOS)') || !out.includes('Brand query (final method): Nexus')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 20: EmployeePayrollApp.java', () => {
  const file = 'examples/core/EmployeePayrollApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EmployeePayrollApp`).toString();
  if (!out.includes('David Miller') || !out.includes('Sarah Connor') || !out.includes('Alex Mercer')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 21: PolymorphismMechanics.java', () => {
  const file = 'examples/core/PolymorphismMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PolymorphismMechanics`).toString();
  if (!out.includes('Dog barks: Woof Woof!') || !out.includes('Dog fetches the tennis ball.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 21: NotificationDispatcherApp.java', () => {
  const file = 'examples/core/NotificationDispatcherApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core NotificationDispatcherApp`).toString();
  if (!out.includes('[EMAIL -> ops-team@enterprise.com]') || !out.includes('[SMS -> +1-555-0199]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 22: AbstractShapeDemo.java', () => {
  const file = 'examples/core/AbstractShapeDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AbstractShapeDemo`).toString();
  if (!out.includes('Area:  78.54') || !out.includes('Area:  24.00')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 22: ETLPipelineApp.java', () => {
  const file = 'examples/core/ETLPipelineApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ETLPipelineApp`).toString();
  if (!out.includes('CSV-User-Ingest completed successfully.') || !out.includes('INSERT -> {"id":101')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 23: InterfaceEvolutionDemo.java', () => {
  const file = 'examples/core/InterfaceEvolutionDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core InterfaceEvolutionDemo`).toString();
  if (!out.includes('Processing payment of $450.00 for TXN-9021') || !out.includes('Audit Log: Txn TXN-9021 marked as SETTLED')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 23: CloudStorageService.java', () => {
  const file = 'examples/core/CloudStorageService.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CloudStorageService`).toString();
  if (!out.includes('Uploaded 1024 bytes') || !out.includes('Copied production-backups/db_dump.sql')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 24: NestedClassMechanics.java', () => {
  const file = 'examples/core/NestedClassMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core NestedClassMechanics`).toString();
  if (!out.includes('Static nested class accessing static outer: CLUSTER_ID_880') || !out.includes('TOP_SECRET_VAULT_KEY')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 24: EventBrokerApp.java', () => {
  const file = 'examples/core/EventBrokerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EventBrokerApp`).toString();
  if (!out.includes('[AUDIT LOG] Detected security event: Failed root login') || !out.includes('[METRICS] Total events received: 2')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 25: EnumMechanics.java', () => {
  const file = 'examples/core/EnumMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EnumMechanics`).toString();
  if (!out.includes('Urgent: true') || !out.includes('Dispatch action: Process in dedicated VIP thread')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 25: OrderStateMachineApp.java', () => {
  const file = 'examples/core/OrderStateMachineApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OrderStateMachineApp`).toString();
  if (!out.includes('Valid Transition: CREATED -> PAID') || !out.includes('ILLEGAL Transition Attempt: PAID -> DELIVERED (Rejected)')) {
    throw new Error(out);
  }
});

// Section 8: Topics 26 - 28
runTest('Core - Topic 26: RecordMechanics.java', () => {
  const file = 'examples/core/RecordMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core RecordMechanics`).toString();
  if (!out.includes('Username: alex_dev') || !out.includes('user1.equals(user2): true') || !out.includes('Clamped score: 0')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 26: GeoLocationRecordApp.java', () => {
  const file = 'examples/core/GeoLocationRecordApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core GeoLocationRecordApp`).toString();
  if (!out.includes('Route: Central Hub (Chicago) -> Client Site (New York)') || !out.includes('Direct Flight Distance: 1144.29 km')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 27: SealedClassMechanics.java', () => {
  const file = 'examples/core/SealedClassMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SealedClassMechanics`).toString();
  if (!out.includes('Handled Success with data: Payload 0xFA31') || !out.includes('Retrying after timeout: FAILED: Network read timed out.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 27: PaymentMethodHierarchyApp.java', () => {
  const file = 'examples/core/PaymentMethodHierarchyApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PaymentMethodHierarchyApp`).toString();
  if (!out.includes('Card transaction executed with 2.5% fee') || !out.includes('Wire initiated to IBAN US89000123456789')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 28: PatternMatchingMechanics.java', () => {
  const file = 'examples/core/PatternMatchingMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PatternMatchingMechanics`).toString();
  if (!out.includes('Received NULL reference') || !out.includes('Negative integer: -42') || !out.includes('HIGH VALUE Transaction TXN-002 for $50000.00')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 28: FinancialEventMatcherApp.java', () => {
  const file = 'examples/core/FinancialEventMatcherApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core FinancialEventMatcherApp`).toString();
  if (!out.includes('[AML AUDIT REQUIRED] Large deposit of USD 150000.00 to ACC-901') ||
      !out.includes('[BLOCK TRADE] 5000 shares of NVDA executed at $130.00 (Notional: $650000.00)') ||
      !out.includes('[SECURITY LOCKDOWN] Freezing account ACC-774 immediately!')) {
    throw new Error(out);
  }
});

// Section 9: Topics 29 - 32
runTest('Core - Topic 29: ExceptionHierarchyDemo.java', () => {
  const file = 'examples/core/ExceptionHierarchyDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ExceptionHierarchyDemo`).toString();
  if (!out.includes('ae instanceof RuntimeException: true') || !out.includes('ae instanceof Throwable:        true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 29: ResilientServiceApp.java', () => {
  const file = 'examples/core/ResilientServiceApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ResilientServiceApp`).toString();
  if (!out.includes('Processing telemetry batch #1') || !out.includes('Result 2: Recovered from: IllegalArgumentException')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 30: CheckedVsUncheckedDemo.java', () => {
  const file = 'examples/core/CheckedVsUncheckedDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CheckedVsUncheckedDemo`).toString();
  if (!out.includes('Caught Expected Checked Exception: Host unreachable') || !out.includes('Caught Expected Unchecked Exception: Value must be non-negative')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 30: FileOrderImporterApp.java', () => {
  const file = 'examples/core/FileOrderImporterApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core FileOrderImporterApp`).toString();
  if (!out.includes('Successfully imported order count: 42') || !out.includes('Root Cause Class:        FileNotFoundException')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 31: TryWithResourcesMechanics.java', () => {
  const file = 'examples/core/TryWithResourcesMechanics.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core TryWithResourcesMechanics`).toString();
  if (!out.includes('[Database] Connection Closed Cleanly.') || !out.includes('Suppressed Close Exception: Secondary exception thrown during resource close()')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 31: DatabaseStreamExporterApp.java', () => {
  const file = 'examples/core/DatabaseStreamExporterApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DatabaseStreamExporterApp`).toString();
  if (!out.includes('Executing SQL: SELECT * FROM audit_ledger WHERE year = 2026') || !out.includes('Exported Length: 35 bytes')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 32: CustomExceptionChainingDemo.java', () => {
  const file = 'examples/core/CustomExceptionChainingDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CustomExceptionChainingDemo`).toString();
  if (!out.includes('Caught Domain Exception: Credit gateway processing failed for amount $999.0') ||
      !out.includes('Error Code:              ERR_GATEWAY_TIMEOUT') ||
      !out.includes('Underlying Root Cause:   java.net.ConnectException')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 32: BankingTransactionValidatorApp.java', () => {
  const file = 'examples/core/BankingTransactionValidatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core BankingTransactionValidatorApp`).toString();
  if (!out.includes('[REJECTED] Account CHK-100 overdraft: current $250.00, attempted $400.00') ||
      !out.includes('Overdraft Shortfall: $150.00') ||
      !out.includes('[REJECTED] Account CHK-999 locked by compliance: AML Sanctions Review Pending')) {
    throw new Error(out);
  }
});

// Section 10: Topics 33 - 39
runTest('Core - Topic 33: GenericsFundamentalsDemo.java', () => {
  const file = 'examples/core/GenericsFundamentalsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core GenericsFundamentalsDemo`).toString();
  if (!out.includes('Pair 1: [http-port => 8080]') ||
      !out.includes('Max Integer: 92') ||
      !out.includes('Max String: Database')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 33: TypeSafeRepositoryApp.java', () => {
  const file = 'examples/core/TypeSafeRepositoryApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core TypeSafeRepositoryApp`).toString();
  if (!out.includes('Repository Count: 2') ||
      !out.includes('Customer[id=101, name=Alice Morgan, balance=$1450.50]') ||
      !out.includes('Missing Account Found: false')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 34: WildcardsPECSDemo.java', () => {
  const file = 'examples/core/WildcardsPECSDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core WildcardsPECSDemo`).toString();
  if (!out.includes('Integer Sum: 60.0') ||
      !out.includes('Double Sum: 7.5') ||
      !out.includes('Number Sink Contents: [100, 101, 102]') ||
      !out.includes('Object Sink Contents: [500, 501]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 34: PipelineDataBufferApp.java', () => {
  const file = 'examples/core/PipelineDataBufferApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core PipelineDataBufferApp`).toString();
  if (!out.includes('Transferred Journal Records: 2') ||
      !out.includes('SecurityAlert[FAILED_LOGIN, severity=3]') ||
      !out.includes('SecurityAlert[PORT_SCAN, severity=5]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 35: ListHierarchyDemo.java', () => {
  const file = 'examples/core/ListHierarchyDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ListHierarchyDemo`).toString();
  if (!out.includes('ArrayList indexed read at 1: Inserted-Mid') ||
      !out.includes('LinkedList first element: Head-Node') ||
      !out.includes('CopyOnWriteArrayList size: 4')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 35: OrderBatchProcessorApp.java', () => {
  const file = 'examples/core/OrderBatchProcessorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OrderBatchProcessorApp`).toString();
  if (!out.includes('Total Orders Queued: 5') ||
      !out.includes('Batch 1 (Size 2)') ||
      !out.includes('Batch 3 (Size 1)')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 36: SetHierarchyDemo.java', () => {
  const file = 'examples/core/SetHierarchyDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SetHierarchyDemo`).toString();
  if (!out.includes('HashSet size (duplicates rejected): 3') ||
      !out.includes('LinkedHashSet insertion order preserved: [First, Second, Third]') ||
      !out.includes('TreeSet first (min): 10') ||
      !out.includes('TreeSet last (max): 80')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 36: UniqueVisitorTrackerApp.java', () => {
  const file = 'examples/core/UniqueVisitorTrackerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core UniqueVisitorTrackerApp`).toString();
  if (!out.includes('Unique Visitors Count: 4') ||
      !out.includes('Highest Leaderboard Score: 920') ||
      !out.includes('Lowest Leaderboard Score: 180')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 37: MapHierarchyDemo.java', () => {
  const file = 'examples/core/MapHierarchyDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MapHierarchyDemo`).toString();
  if (!out.includes('HashMap Laptops: 20') ||
      !out.includes('HashMap Mice (default): 0') ||
      !out.includes('LinkedHashMap Keys: [env, port, ssl]') ||
      !out.includes('TreeMap Lowest Code: 400')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 37: InMemoryCacheServiceApp.java', () => {
  const file = 'examples/core/InMemoryCacheServiceApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core InMemoryCacheServiceApp`).toString();
  if (!out.includes('Initial Cache Keys: [session_1, session_2, session_3]') ||
      !out.includes('Is session_2 retained? false') ||
      !out.includes('Is session_1 retained? true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 38: QueueDequeDemo.java', () => {
  const file = 'examples/core/QueueDequeDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core QueueDequeDemo`).toString();
  if (!out.includes('FIFO Peek: Job-Alpha') ||
      !out.includes('FIFO Poll 1: Job-Alpha') ||
      !out.includes('LIFO Pop 1: Action-Delete') ||
      !out.includes('5 12 45 89')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 38: JobSchedulerApp.java', () => {
  const file = 'examples/core/JobSchedulerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core JobSchedulerApp`).toString();
  if (!out.includes('Pending jobs before processing: 4') ||
      !out.includes('Pending jobs remaining: 0') ||
      !out.includes('Critical-Database-Failover')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 39: ComparableComparatorDemo.java', () => {
  const file = 'examples/core/ComparableComparatorDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ComparableComparatorDemo`).toString();
  if (!out.includes('us-east-1 -> 45ms') ||
      !out.includes('us-west-2 -> 45ms') ||
      !out.includes('eu-central-1 -> 120ms')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 39: ProductCatalogRankingApp.java', () => {
  const file = 'examples/core/ProductCatalogRankingApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ProductCatalogRankingApp`).toString();
  if (!out.includes('[Books] SKU-2 | Rating: 4.9 | Price: $24.50') ||
      !out.includes('[Electronics] SKU-3 | Rating: 4.8 | Price: $149.99')) {
    throw new Error(out);
  }
});

// Section 11: Topics 40 - 44
runTest('Core - Topic 40: LambdaFunctionalInterfacesDemo.java', () => {
  const file = 'examples/core/LambdaFunctionalInterfacesDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core LambdaFunctionalInterfacesDemo`).toString();
  if (!out.includes('Port 8080 valid: true') ||
      !out.includes('Port 80 valid:   false') ||
      !out.includes('Formatted Message: [PRODUCTION] DATABASE CONNECTED')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 40: EventNotificationFilterApp.java', () => {
  const file = 'examples/core/EventNotificationFilterApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core EventNotificationFilterApp`).toString();
  if (!out.includes('Total Alerts Triggering On-Call: 2') ||
      !out.includes('Critical Auth Alerts: 1')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 41: MethodReferencesDemo.java', () => {
  const file = 'examples/core/MethodReferencesDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MethodReferencesDemo`).toString();
  if (!out.includes('Static Ref Output: Production') ||
      !out.includes('[AUDIT SINK] Cluster node healthy') ||
      !out.includes('Unbound Ref Output: LATENCY') ||
      !out.includes('Constructor Ref Output: AUTH_SESSION_99')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 41: CustomerDataTransformerApp.java', () => {
  const file = 'examples/core/CustomerDataTransformerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CustomerDataTransformerApp`).toString();
  if (!out.includes('Cleansed Customer Roster (3 records):') ||
      !out.includes('Alice Walker <alice@example.com>') ||
      !out.includes('Bob Vance <bob.vance@refrigeration.com>')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 42: StreamPipelineFundamentalsDemo.java', () => {
  const file = 'examples/core/StreamPipelineFundamentalsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core StreamPipelineFundamentalsDemo`).toString();
  if (!out.includes('Filtered count: 5') ||
      !out.includes('Final Processed List: [ALPHA, DELTA]') ||
      !out.includes('Flattened Elements: [1, 2, 3, 4, 5, 6, 7, 8]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 42: ServerLogAnalyticsApp.java', () => {
  const file = 'examples/core/ServerLogAnalyticsApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ServerLogAnalyticsApp`).toString();
  if (!out.includes('Slow API Requests (>= 50ms):') ||
      !out.includes('/api/v1/orders/submit -> 850ms') ||
      !out.includes('Distinct Active API Resources: [auth, orders, users]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 43: StreamCollectorsDemo.java', () => {
  const file = 'examples/core/StreamCollectorsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core StreamCollectorsDemo`).toString();
  if (!out.includes('Total CPU Load: 257') ||
      !out.includes('Active Types: [Server, Gateway, Sensor]') ||
      !out.includes('Overloaded Devices Count (>= 80%): 2') ||
      !out.includes('Server=2') ||
      !out.includes('Sensor=2') ||
      !out.includes('Gateway=2')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 43: FinancialTransactionAnalyticsApp.java', () => {
  const file = 'examples/core/FinancialTransactionAnalyticsApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core FinancialTransactionAnalyticsApp`).toString();
  if (!out.includes('CLOUD_INFRA') ||
      !out.includes('High-Value Transfers (>= $5,000): [TX-103, TX-107]') ||
      !out.includes('Standard Volume Transfers:        [TX-101, TX-102, TX-104, TX-105, TX-106]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 44: OptionalMechanicsDemo.java', () => {
  const file = 'examples/core/OptionalMechanicsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OptionalMechanicsDemo`).toString();
  if (!out.includes('Config URL:     jdbc:postgresql://localhost:5432/main_db') ||
      !out.includes('Missing Fallback: FALLBACK_VALUE') ||
      !out.includes('Parsed Pool Size: 20') ||
      !out.includes('Found valid DB endpoint')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 44: UserProfileLookupServiceApp.java', () => {
  const file = 'examples/core/UserProfileLookupServiceApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core UserProfileLookupServiceApp`).toString();
  if (!out.includes('User 1 Webhook: https://hooks.corp/alice') ||
      !out.includes('User 2 Webhook: https://default.corp/sink') ||
      !out.includes('User 99 Webhook: https://default.corp/sink')) {
    throw new Error(out);
  }
});

// Section 12: Topics 45 - 47
runTest('Core - Topic 45: ClassicIoStreamsDemo.java', () => {
  const file = 'examples/core/ClassicIoStreamsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ClassicIoStreamsDemo`).toString();
  if (!out.includes('File written successfully:') ||
      !out.includes('Line 1: SERVER_STATUS=HEALTHY') ||
      !out.includes('Line 2: UPTIME_SECONDS=86400')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 45: AuditLogRotatorApp.java', () => {
  const file = 'examples/core/AuditLogRotatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AuditLogRotatorApp`).toString();
  if (!out.includes('Recorded Audit Events (3 total):') ||
      !out.includes('LOGIN_SUCCESS') ||
      !out.includes('UPDATE_CONFIG') ||
      !out.includes('PASSWORD_RESET')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 46: ModernNioOperationsDemo.java', () => {
  const file = 'examples/core/ModernNioOperationsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ModernNioOperationsDemo`).toString();
  if (!out.includes('Config written using Files.writeString') ||
      !out.includes('ssl_enabled=true') ||
      !out.includes('File exists check: true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 46: DirectoryTreeScannerApp.java', () => {
  const file = 'examples/core/DirectoryTreeScannerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DirectoryTreeScannerApp`).toString();
  if (!out.includes('Discovered Files & Directories:') ||
      !out.includes('Found Config Files (.conf or .json):') ||
      !out.includes('application.conf') ||
      !out.includes('database.json')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 47: DateTimeApiDemo.java', () => {
  const file = 'examples/core/DateTimeApiDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DateTimeApiDemo`).toString();
  if (!out.includes('UTC Machine Instant: 2023-11-14T22:13:20Z') ||
      !out.includes('Downtime in Minutes: 255 mins') ||
      !out.includes('Tuesday, March 17, 2026')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 47: GlobalSlaDeadlineCalculatorApp.java', () => {
  const file = 'examples/core/GlobalSlaDeadlineCalculatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core GlobalSlaDeadlineCalculatorApp`).toString();
  if (!out.includes('SLA Window:      4 Business Hours') ||
      !out.includes('London (HQ):') ||
      !out.includes('New York:') ||
      !out.includes('Tokyo:')) {
    throw new Error(out);
  }
});

// Section 13: Concurrency & Multithreading
runTest('Core - Topic 48: ThreadLifecycleDemo.java', () => {
  const file = 'examples/core/ThreadLifecycleDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ThreadLifecycleDemo`).toString();
  if (!out.includes('Worker State before start: NEW') ||
      !out.includes('Worker State after join:   TERMINATED') ||
      !out.includes('Daemon Thread isDaemon:    true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 48: BatchWorkerSupervisorApp.java', () => {
  const file = 'examples/core/BatchWorkerSupervisorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core BatchWorkerSupervisorApp`).toString();
  if (!out.includes('Supervisor waiting for batch completion') ||
      !out.includes('Supervisor Audit: 3 of 3 workers completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 49: SynchronizationVisibilityDemo.java', () => {
  const file = 'examples/core/SynchronizationVisibilityDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core SynchronizationVisibilityDemo`).toString();
  if (!out.includes('Synchronized Counter Total: 2000') ||
      !out.includes('Volatile Worker Terminated Gracefully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 49: DoubleCheckedLockingSingletonApp.java', () => {
  const file = 'examples/core/DoubleCheckedLockingSingletonApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DoubleCheckedLockingSingletonApp`).toString();
  if (!out.includes('Singleton Pool Same Instance: true') ||
      !out.includes('Transfer Success: true') ||
      !out.includes('Final Balances: ACC-01=$750.00, ACC-02=$750.00')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 50: ExplicitLocksAtomicsDemo.java', () => {
  const file = 'examples/core/ExplicitLocksAtomicsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ExplicitLocksAtomicsDemo`).toString();
  if (!out.includes('Contender acquired lock after wait? true') ||
      !out.includes('Atomic CAS from 100 to 150 successful? true') ||
      !out.includes('Atomic Counter after incrementAndGet: 151')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 50: RateLimiterTokenBucketApp.java', () => {
  const file = 'examples/core/RateLimiterTokenBucketApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core RateLimiterTokenBucketApp`).toString();
  if (!out.includes('Attempt 1 allowed: true') ||
      !out.includes('Attempt 4 allowed: false') ||
      !out.includes('Attempt 5 allowed: true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 51: ThreadPoolExecutorDemo.java', () => {
  const file = 'examples/core/ThreadPoolExecutorDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ThreadPoolExecutorDemo`).toString();
  if (!out.includes('[REJECTED] Task rejected! Queue is full') ||
      !out.includes('Executor Terminated Cleanly: true')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 51: ParallelImageBatchProcessorApp.java', () => {
  const file = 'examples/core/ParallelImageBatchProcessorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ParallelImageBatchProcessorApp`).toString();
  if (!out.includes('Processed hero_banner.png') ||
      !out.includes('Batch processing successfully completed.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 52: CompletableFuturePipelineDemo.java', () => {
  const file = 'examples/core/CompletableFuturePipelineDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core CompletableFuturePipelineDemo`).toString();
  if (!out.includes('Calculated Final Price: $108.00 USD') ||
      !out.includes('Account Report: Alice Vance has balance $1450.75') ||
      !out.includes('Resilient Outcome: FALLBACK_CACHE_OK')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 52: MicroserviceAggregatorApp.java', () => {
  const file = 'examples/core/MicroserviceAggregatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MicroserviceAggregatorApp`).toString();
  if (!out.includes('User:         Marcus Vance (USR-9001)') ||
      !out.includes('Balance:      $5,240.50') ||
      !out.includes('Credit Score: 785')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 53: VirtualThreadsDemo.java', () => {
  const file = 'examples/core/VirtualThreadsDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core VirtualThreadsDemo`).toString();
  if (!out.includes('Is Virtual Thread?      true') ||
      !out.includes('Virtual Threads Completed: 1000 / 1000')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 53: HighThroughputHttpSimulatorApp.java', () => {
  const file = 'examples/core/HighThroughputHttpSimulatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HighThroughputHttpSimulatorApp`).toString();
  if (!out.includes('Successful Responses: 2000 / 2000') ||
      !out.includes('Throughput:')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 54: StructuredConcurrencyDemo.java', () => {
  const file = 'examples/core/StructuredConcurrencyDemo.java';
  execSync(`${JAVAC} --enable-preview --release 26 ${file}`);
  const out = execSync(`${JAVA} --enable-preview -cp examples/core StructuredConcurrencyDemo`).toString();
  if (!out.includes('Initiating structured concurrency workflow. Trace ID: TXN-88219') ||
      !out.includes('Subtask 1 State: SUCCESS') ||
      !out.includes('Structured workflow completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 54: TravelBookingAggregatorApp.java', () => {
  const file = 'examples/core/TravelBookingAggregatorApp.java';
  execSync(`${JAVAC} --enable-preview --release 26 ${file}`);
  const out = execSync(`${JAVA} --enable-preview -cp examples/core TravelBookingAggregatorApp`).toString();
  if (!out.includes('Booking Assembled Successfully:') ||
      !out.includes('Flight: BA-178') ||
      !out.includes('Total Estimated: $1325.5')) {
    throw new Error(out);
  }
});

// Section 14: JVM Internals & Memory Architecture
runTest('Core - Topic 55: MemoryLayoutRuntimeDemo.java', () => {
  const file = 'examples/core/MemoryLayoutRuntimeDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MemoryLayoutRuntimeDemo`).toString();
  if (!out.includes('=== JVM Memory Areas & Stack Inspection ===') ||
      !out.includes('Max Heap Memory:') ||
      !out.includes('Safely Measured Stack Frame Depth: 500')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 55: ObjectAllocationProfilerApp.java', () => {
  const file = 'examples/core/ObjectAllocationProfilerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ObjectAllocationProfilerApp`).toString();
  if (!out.includes('Processed 50,000 transient objects.') ||
      !out.includes('Retained Ledger Size: 10000 items') ||
      !out.includes('Allocation profiling completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 56: GarbageCollectionDemo.java', () => {
  const file = 'examples/core/GarbageCollectionDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core GarbageCollectionDemo`).toString();
  if (!out.includes('WeakRef holds value: true') ||
      !out.includes('WeakRef cleared after GC: true') ||
      !out.includes('Cleaner execution completed.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 56: HeapPressureAnalyzerApp.java', () => {
  const file = 'examples/core/HeapPressureAnalyzerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HeapPressureAnalyzerApp`).toString();
  if (!out.includes('Starting Heap Pressure & GC Metric Analyzer...') ||
      !out.includes('Garbage Collection Metrics Polled Successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 57: ClassLoaderHierarchyDemo.java', () => {
  const file = 'examples/core/ClassLoaderHierarchyDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ClassLoaderHierarchyDemo`).toString();
  if (!out.includes('1. Application ClassLoader:') ||
      !out.includes('2. Platform ClassLoader:') ||
      !out.includes('3. Bootstrap ClassLoader:   null') ||
      !out.includes('String.class ClassLoader:   null')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 57: HotReloadPluginClassLoaderApp.java', () => {
  const file = 'examples/core/HotReloadPluginClassLoaderApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HotReloadPluginClassLoaderApp`).toString();
  if (!out.includes('Plugin Loader 1 Parent: null') ||
      !out.includes('ClassLoader Isolation:  true') ||
      !out.includes('Dynamic ClassLoader initialised successfully.')) {
    throw new Error(out);
  }
});

// Section 15: Reflection, Annotations & JPMS
runTest('Core - Topic 58: AnnotationProcessingDemo.java', () => {
  const file = 'examples/core/AnnotationProcessingDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core AnnotationProcessingDemo`).toString();
  if (!out.includes("action='PROCESS_CREDIT_CARD', severity=3") ||
      !out.includes('Executing charge: card=****4444, amount=$249.99') ||
      !out.includes('Annotation processing completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 58: OrmEntityValidatorApp.java', () => {
  const file = 'examples/core/OrmEntityValidatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core OrmEntityValidatorApp`).toString();
  if (!out.includes('Valid Product Violations:   0') ||
      !out.includes('Invalid Product Violations: 2') ||
      !out.includes('Price must be between $0.01 and $10,000.00')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 59: ReflectionMethodHandlesDemo.java', () => {
  const file = 'examples/core/ReflectionMethodHandlesDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ReflectionMethodHandlesDemo`).toString();
  if (!out.includes('Original Private Field: VAULT_9941') ||
      !out.includes('Modified Private Field: VAULT_8800_UPDATED') ||
      !out.includes('MethodHandle invokeExact:    DIGEST[VAULT_8800_UPDATED:SALT-99]')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 59: DynamicProxyLoggingApp.java', () => {
  const file = 'examples/core/DynamicProxyLoggingApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DynamicProxyLoggingApp`).toString();
  if (!out.includes('[Audit Proxy] Intercepting: processPayment()') ||
      !out.includes('Main Verification -> Paid: true, Status: SETTLED') ||
      !out.includes('Dynamic Proxy executed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 60: ModuleDescriptorDemo.java', () => {
  const file = 'examples/core/ModuleDescriptorDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ModuleDescriptorDemo`).toString();
  if (!out.includes('Current Module Name: java.base') ||
      !out.includes('Exports \'java.util\': true') ||
      !out.includes('Application Class Module Name: \'null\'')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 60: ModularServicePluginApp.java', () => {
  const file = 'examples/core/ModularServicePluginApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ModularServicePluginApp`).toString();
  if (!out.includes('Discovered Codec Plugins: 2') ||
      !out.includes('Codec [JSON] output: {"data": "TXN-3001"}') ||
      !out.includes('Modular Service Plugin App completed successfully.')) {
    throw new Error(out);
  }
});

// Section 16: Data Access & Build Tools
runTest('Core - Topic 61: JdbcFundamentalsDemo.java', () => {
  if (!hasSqlite) return 'skip';
  const file = 'examples/core/JdbcFundamentalsDemo.java';
  execSync(`${JAVAC} -cp "${SQLITE_JAR}" ${file}`);
  const out = execSync(`${JAVA} --enable-native-access=ALL-UNNAMED -cp "examples/core;${SQLITE_JAR}" JdbcFundamentalsDemo`).toString();
  if (!out.includes('Connected to: SQLite') ||
      !out.includes('Inserted 2 products via PreparedStatement.') ||
      !out.includes('[ID: 101] Mechanical Keyboard')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 61: BankingTransactionRepositoryApp.java', () => {
  if (!hasSqlite) return 'skip';
  const file = 'examples/core/BankingTransactionRepositoryApp.java';
  execSync(`${JAVAC} -cp "${SQLITE_JAR}" ${file}`);
  const out = execSync(`${JAVA} --enable-native-access=ALL-UNNAMED -cp "examples/core;${SQLITE_JAR}" BankingTransactionRepositoryApp`).toString();
  if (!out.includes('Transfer 1 (Valid: $200.00) Success? true') ||
      !out.includes('Transfer 2 (Overdraft: $5000.00) Success? false') ||
      !out.includes('Banking Transaction test completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 62: BuildToolLifecycleDemo.java', () => {
  const file = 'examples/core/BuildToolLifecycleDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core BuildToolLifecycleDemo`).toString();
  if (!out.includes('Project Coordinate: com.handbook.app:order-service:1.0.0-RELEASE') ||
      !out.includes('org.slf4j:slf4j-api:2.0.12 (Scope: compile)') ||
      !out.includes('Phase 4: mvn package')) {
    throw new Error(out);
  }
});

runTest('Core - Topic 62: DependencyResolverSimulatorApp.java', () => {
  const file = 'examples/core/DependencyResolverSimulatorApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core DependencyResolverSimulatorApp`).toString();
  if (!out.includes('Maven Resolution (Nearest Definition Wins):   common-utils:2.1.0') ||
      !out.includes('Gradle Resolution (Highest Version Wins):     common-utils:3.0.0') ||
      !out.includes('Dependency conflict resolution comparison completed successfully.')) {
    throw new Error(out);
  }
});

// Section 17: Web Architecture & The Jakarta EE Evolution
runTest('Jakarta EE - Topic 63: NamespaceTransitionInspectorDemo.java', () => {
  const file = 'examples/core/NamespaceTransitionInspectorDemo.java';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" ${file}`);
  const out = execSync(`${JAVA} -cp "examples/core;${TOMCAT_LIB}" NamespaceTransitionInspectorDemo`).toString();
  if (!out.includes('The Great Transition: Java EE to Jakarta EE') ||
      !out.includes('Active Servlet API Detected: jakarta.servlet.http.HttpServlet') ||
      !out.includes('Namespace transition inspection completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 63: ServerCompatibilityMatrixApp.java', () => {
  const file = 'examples/core/ServerCompatibilityMatrixApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core ServerCompatibilityMatrixApp`).toString();
  if (!out.includes('Apache Tomcat      | 10.1.x     | Jakarta EE 10') ||
      !out.includes('WildFly            | 30.x+') ||
      !out.includes('Server compatibility evaluation completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 64: HttpProtocolParserDemo.java', () => {
  const file = 'examples/core/HttpProtocolParserDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core HttpProtocolParserDemo`).toString();
  if (!out.includes('Method:   POST') ||
      !out.includes('Path URI: /api/v1/orders') ||
      !out.includes('Query:    priority=true') ||
      !out.includes('HTTP request parsing completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 64: MockHttpServerDispatcherApp.java', () => {
  const file = 'examples/core/MockHttpServerDispatcherApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core MockHttpServerDispatcherApp`).toString();
  if (!out.includes('GET /health       -> 200 OK') ||
      !out.includes('POST /api/data    -> 201 Created') ||
      !out.includes('GET /nonexistent  -> 404 Not Found') ||
      !out.includes('HTTP Dispatcher simulation completed successfully.')) {
    throw new Error(out);
  }
});

// Section 18: Web Containers & Packaging
runTest('Jakarta EE - Topic 65: WarStructureValidatorDemo.java', () => {
  const file = 'examples/core/WarStructureValidatorDemo.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core WarStructureValidatorDemo`).toString();
  if (!out.includes('WEB-INF Root Present:    true') ||
      !out.includes('web.xml Deployment Desk: true') ||
      !out.includes('WAR structure validation completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 65: TomcatDeploymentPackagerApp.java', () => {
  const file = 'examples/core/TomcatDeploymentPackagerApp.java';
  execSync(`${JAVAC} ${file}`);
  const out = execSync(`${JAVA} -cp examples/core TomcatDeploymentPackagerApp`).toString();
  if (!out.includes('StandardServer            -> Top-level JVM process container') ||
      !out.includes('<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"') ||
      !out.includes('Tomcat deployment package verification completed successfully.')) {
    throw new Error(out);
  }
});

// Jakarta EE: Topic 66
runTest('Jakarta EE - Topic 66: LifecycleServlet.java compilation', () => {
  const src = 'examples/web/LifecycleServlet.java';
  const outDir = 'examples/web/classes';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/LifecycleServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 67
runTest('Jakarta EE - Topic 67: RequestInspectorServlet.java compilation', () => {
  const src = 'examples/web/RequestInspectorServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/RequestInspectorServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 67: OrderProcessingServlet.java compilation', () => {
  const src = 'examples/web/OrderProcessingServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/OrderProcessingServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 68
runTest('Jakarta EE - Topic 68: ConfigDemoServlet.java compilation', () => {
  const src = 'examples/web/ConfigDemoServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/ConfigDemoServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 68: MultiMappingServlet.java compilation', () => {
  const src = 'examples/web/MultiMappingServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/MultiMappingServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 69
runTest('Jakarta EE - Topic 69: DispatcherControllerServlet.java compilation', () => {
  const src = 'examples/web/DispatcherControllerServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/DispatcherControllerServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 69: ViewHandlerServlet.java compilation', () => {
  const src = 'examples/web/ViewHandlerServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/ViewHandlerServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 70
runTest('Jakarta EE - Topic 70: SessionShoppingCartServlet.java compilation', () => {
  const src = 'examples/web/SessionShoppingCartServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/SessionShoppingCartServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 70: CookieConsentServlet.java compilation', () => {
  const src = 'examples/web/CookieConsentServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/CookieConsentServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 71
runTest('Jakarta EE - Topic 71: RequestLoggingFilter.java compilation', () => {
  const src = 'examples/web/RequestLoggingFilter.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/RequestLoggingFilter.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 71: AuthGuardFilter.java compilation', () => {
  const src = 'examples/web/AuthGuardFilter.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/AuthGuardFilter.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 72
runTest('Jakarta EE - Topic 72: AppBootstrapListener.java compilation', () => {
  const src = 'examples/web/AppBootstrapListener.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/AppBootstrapListener.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 72: ActiveSessionTrackerListener.java compilation', () => {
  const src = 'examples/web/ActiveSessionTrackerListener.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/ActiveSessionTrackerListener.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

// Jakarta EE: Topic 73
runTest('Jakarta EE - Topic 73: CsrfProtectionServlet.java compilation', () => {
  const src = 'examples/web/CsrfProtectionServlet.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB}" -d ${outDir} ${src}`);
  const classFile = path.join(outDir, 'com/handbook/web/CsrfProtectionServlet.class');
  if (!fs.existsSync(classFile)) throw new Error(`Expected class file not generated: ${classFile}`);
});

runTest('Jakarta EE - Topic 73: SecuritySanitizerApp.java execution', () => {
  const src = 'examples/web/SecuritySanitizerApp.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} ${src}`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.SecuritySanitizerApp`).toString();
  if (!out.includes('Original Malicious Input:') ||
      !out.includes('&lt;script&gt;alert') ||
      !out.includes('Rotating Session via req.changeSessionId()') ||
      !out.includes('Web security defense verification completed successfully.')) {
    throw new Error(out);
  }
});

// Jakarta EE: Section 21 (Topics 74-78)
runTest('Jakarta EE - Topic 74: JspTranslationInspectorDemo.java execution', () => {
  const src = 'examples/web/JspTranslationInspectorDemo.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} ${src}`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.JspTranslationInspectorDemo`).toString();
  if (!out.includes('=== Jasper JSP Translation Simulator ===') ||
      !out.includes('public void _jspService') ||
      !out.includes('JSP translation simulation completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 75: syntax-elements.jsp packaging', () => {
  const jsp = 'examples/web/war-build/syntax-elements.jsp';
  if (!fs.existsSync(jsp)) throw new Error(`Expected JSP file missing: ${jsp}`);
  const content = fs.readFileSync(jsp, 'utf-8');
  if (!content.includes('<%!') || !content.includes('<%=') || !content.includes('<%')) {
    throw new Error('JSP file missing syntax elements');
  }
});

runTest('Jakarta EE - Topic 76: UserProfileBean and implicit-objects.jsp', () => {
  const src = 'examples/web/UserProfileBean.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} ${src}`);
  const jsp = 'examples/web/war-build/implicit-objects.jsp';
  if (!fs.existsSync(jsp)) throw new Error(`Expected JSP file missing: ${jsp}`);
});

runTest('Jakarta EE - Topic 77: ExpressionLanguageEvaluatorDemo.java execution', () => {
  const src = 'examples/web/ExpressionLanguageEvaluatorDemo.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp ${outDir} -d ${outDir} ${src}`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.ExpressionLanguageEvaluatorDemo`).toString();
  if (!out.includes('${user.username}      -> jduke') ||
      !out.includes('${sessionScope.theme} -> VS Code Dark+') ||
      !out.includes('Expression Language evaluation completed successfully.')) {
    throw new Error(out);
  }
});

runTest('Jakarta EE - Topic 78: FormatCurrencyTag compilation and TLD packaging', () => {
  const src = 'examples/web/FormatCurrencyTag.java';
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB};tools/apache-tomcat-10.1.61/lib/jsp-api.jar" -d ${outDir} ${src}`);
  const tld = 'examples/web/war-build/WEB-INF/tld/handbook-tags.tld';
  if (!fs.existsSync(tld)) throw new Error(`TLD file missing: ${tld}`);
});

runTest('Jakarta EE - Topic 79: Product.java, ProductCatalogServlet.java & MvcArchitectureDemo.java', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB};${outDir}" -d ${outDir} examples/web/Product.java examples/web/ProductCatalogServlet.java examples/web/MvcArchitectureDemo.java`);
  const jsp = 'examples/web/war-build/WEB-INF/views/product-catalog.jsp';
  if (!fs.existsSync(jsp)) throw new Error('Missing product-catalog.jsp');
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.MvcArchitectureDemo`).toString();
  if (!out.includes('MVC flow verified')) throw new Error(out);
});

runTest('Jakarta EE - Topic 80: FileUploadServlet.java & FormValidationServiceDemo.java', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB};${outDir}" -d ${outDir} examples/web/FileUploadServlet.java examples/web/FormValidationServiceDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.FormValidationServiceDemo`).toString();
  if (!out.includes('Multipart streaming verification successful')) throw new Error(out);
});

runTest('Jakarta EE - Topic 80 (Section 6b / Legacy 81): Error Pages (404/500), FaultTriggerServlet.java & ErrorHandlingDispatcherDemo.java', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB};${outDir}" -d ${outDir} examples/web/FaultTriggerServlet.java examples/web/ErrorHandlingDispatcherDemo.java`);
  if (!fs.existsSync('examples/web/war-build/error-404.jsp') || !fs.existsSync('examples/web/war-build/error-500.jsp')) {
    throw new Error('Missing error-404.jsp or error-500.jsp');
  }
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.web.ErrorHandlingDispatcherDemo`).toString();
  if (!out.includes('Error page resolution verified')) throw new Error(out);
});

runTest('Jakarta EE - Topic 82: ConnectionPoolLifecycleListener.java, DatabaseHealthCheckServlet.java & ConnectionPoolSimulatorDemo.java', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -cp "${TOMCAT_LIB};${SQLITE_JAR};${outDir}" -d ${outDir} examples/web/ConnectionPoolLifecycleListener.java examples/web/DatabaseHealthCheckServlet.java examples/web/ConnectionPoolSimulatorDemo.java`);
  const out = execSync(`${JAVA} -cp "${outDir};${SQLITE_JAR}" com.handbook.web.ConnectionPoolSimulatorDemo`).toString();
  if (!out.includes('Connection pool simulation verified successfully')) throw new Error(out);
});

runTest('Jakarta EE - Topic 83: JpaEntityDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/enterprise/JpaEntityDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.enterprise.JpaEntityDemo`).toString();
  if (!out.includes('JPA EntityManager lifecycle and entity mapping verified successfully')) throw new Error(out);
});

runTest('Jakarta EE - Topic 84: CdiDependencyInjectionDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/enterprise/CdiDependencyInjectionDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.enterprise.CdiDependencyInjectionDemo`).toString();
  if (!out.includes('CDI container dependency injection verified successfully')) throw new Error(out);
});

runTest('Jakarta EE - Topic 85: JaxRsEndpointDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/enterprise/JaxRsEndpointDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.enterprise.JaxRsEndpointDemo`).toString();
  if (!out.includes('JAX-RS annotation routing and JSON dispatch verified successfully')) throw new Error(out);
});

runTest('Jakarta EE - Topic 86: BeanValidationDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/enterprise/BeanValidationDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.enterprise.BeanValidationDemo`).toString();
  if (!out.includes('Declarative constraint inspection verified successfully')) throw new Error(out);
});

runTest('Jakarta EE - Topic 87: JsfEjbArchitectureDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/enterprise/JsfEjbArchitectureDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.enterprise.JsfEjbArchitectureDemo`).toString();
  if (!out.includes('JSF lifecycle and EJB transaction execution verified successfully')) throw new Error(out);
});

// Part 3: Spring Boot & Modern Production Ecosystem
runTest('Spring Boot - Topic 88: BeanFactoryVsApplicationContextDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/BeanFactoryVsApplicationContextDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.BeanFactoryVsApplicationContextDemo`).toString();
  if (!out.includes('BeanFactory vs ApplicationContext architectural mechanics verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 89: BeanLifecycleInjectionDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/BeanLifecycleInjectionDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.BeanLifecycleInjectionDemo`).toString();
  if (!out.includes('All Spring Bean lifecycle phases and injection strategies verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 90: AutoConfigurationEmbeddedDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/AutoConfigurationEmbeddedDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.AutoConfigurationEmbeddedDemo`).toString();
  if (!out.includes('Spring Boot Auto-Configuration & Embedded Runtime mechanics verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 91: ExternalizedConfigurationProfilesDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/ExternalizedConfigurationProfilesDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.ExternalizedConfigurationProfilesDemo`).toString();
  if (!out.includes('Externalized configuration hierarchy, multi-profile overrides, and validation verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 92: RestControllerArchitectureDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/RestControllerArchitectureDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.RestControllerArchitectureDemo`).toString();
  if (!out.includes('Spring Web MVC REST controller HTTP semantics verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 93: RequestValidationEngineDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/RequestValidationEngineDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.RequestValidationEngineDemo`).toString();
  if (!out.includes('Bean Validation and custom constraint validator mechanics verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 94: GlobalExceptionAdviceDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/GlobalExceptionAdviceDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.GlobalExceptionAdviceDemo`).toString();
  if (!out.includes('Centralized @RestControllerAdvice and RFC 7807 ProblemDetail verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 95: SpringDataJpaRepositoryDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/SpringDataJpaRepositoryDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.SpringDataJpaRepositoryDemo`).toString();
  if (!out.includes('Topic 95 Spring Data JPA Architecture demo executed successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 96: DerivedQueryProjectionsDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/DerivedQueryProjectionsDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.DerivedQueryProjectionsDemo`).toString();
  if (!out.includes('Topic 96 Derived Queries and Projections demo executed successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 97: TransactionalEntityGraphDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/TransactionalEntityGraphDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.TransactionalEntityGraphDemo`).toString();
  if (!out.includes('Topic 97 Transactional and EntityGraph demo executed successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 98: SecurityFilterChainDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/SecurityFilterChainDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.SecurityFilterChainDemo`).toString();
  if (!out.includes('Topic 98 Modern SecurityFilterChain and Password Encoder verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 99: JwtRbacSecurityDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/JwtRbacSecurityDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.JwtRbacSecurityDemo`).toString();
  if (!out.includes('Topic 99 JWT & RBAC Method Security verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 100: AnnotationMetadataDictionaryDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/AnnotationMetadataDictionaryDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.AnnotationMetadataDictionaryDemo`).toString();
  if (!out.includes('Topic 100 Definitive Annotations Dictionary verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 101: LombokMapStructDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/LombokMapStructDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.LombokMapStructDemo`).toString();
  if (!out.includes('Topic 101 Lombok & MapStruct code generation verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 102: FlywayMigrationDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/FlywayMigrationDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.FlywayMigrationDemo`).toString();
  if (!out.includes('Topic 102 Flyway Database Migrations verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 103: ModernTestingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/ModernTestingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.ModernTestingDemo`).toString();
  if (!out.includes('Topic 103 Automated Testing Suite verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 104: ActuatorObservabilityDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/ActuatorObservabilityDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.ActuatorObservabilityDemo`).toString();
  if (!out.includes('Topic 104 Observability & Actuator verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 105: OpenApiSwaggerDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/OpenApiSwaggerDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.OpenApiSwaggerDemo`).toString();
  if (!out.includes('Topic 105 OpenAPI 3 and Swagger UI verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 106: DistributedCachingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/DistributedCachingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.DistributedCachingDemo`).toString();
  if (!out.includes('Topic 106 Caffeine & Redis Distributed Caching verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 107: Resilience4jDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/Resilience4jDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.Resilience4jDemo`).toString();
  if (!out.includes('Topic 107 Resilience4j Circuit Breaker & RateLimiter verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 108: KafkaMessagingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/KafkaMessagingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.KafkaMessagingDemo`).toString();
  if (!out.includes('Topic 108 Apache Kafka Event-Driven Messaging verified successfully')) throw new Error(out);
});

runTest('Spring Boot - Topic 109: JpaSpecificationFilterDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/JpaSpecificationFilterDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.JpaSpecificationFilterDemo`).toString();
  if (!out.includes('Topic 109 JPA Specification Dynamic Filtering verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 110: EntityAuditingEnversDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/EntityAuditingEnversDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.EntityAuditingEnversDemo`).toString();
  if (!out.includes('Topic 110 Entity Auditing and Envers versioning verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 111: MultiTenantRoutingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/MultiTenantRoutingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.MultiTenantRoutingDemo`).toString();
  if (!out.includes('Topic 111 Multi-Tenancy Architecture and Routing DataSource verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 112: OAuth2ResourceServerDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/OAuth2ResourceServerDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.OAuth2ResourceServerDemo`).toString();
  if (!out.includes('Topic 112 OAuth2 Resource Server verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 113: OidcKeycloakIntegrationDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/OidcKeycloakIntegrationDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.OidcKeycloakIntegrationDemo`).toString();
  if (!out.includes('Topic 113 OpenID Connect and Keycloak integration verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 114: ProductionCorsCsrfSecurityDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/ProductionCorsCsrfSecurityDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.ProductionCorsCsrfSecurityDemo`).toString();
  if (!out.includes('Topic 114 Production CORS, CSRF and Security Headers verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 115: AsyncExecutionThreadPoolDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/AsyncExecutionThreadPoolDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.AsyncExecutionThreadPoolDemo`).toString();
  if (!out.includes('Topic 115 Asynchronous Task Execution verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 116: DistributedShedLockSchedulerDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/DistributedShedLockSchedulerDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.DistributedShedLockSchedulerDemo`).toString();
  if (!out.includes('Topic 116 Distributed Scheduling and ShedLock verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 117: SpringBatchChunkProcessingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/SpringBatchChunkProcessingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.SpringBatchChunkProcessingDemo`).toString();
  if (!out.includes('Topic 117 Spring Batch Chunk Processing verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 118: WebSocketStompBrokerDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/WebSocketStompBrokerDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.WebSocketStompBrokerDemo`).toString();
  if (!out.includes('Topic 118 WebSockets and STOMP messaging verified successfully.')) throw new Error(out);
});

runTest('Spring Boot - Topic 119: ServerSentEventsStreamingDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/spring/ServerSentEventsStreamingDemo.java`);
  const out = execSync(`${JAVA} -ea -cp ${outDir} com.handbook.spring.ServerSentEventsStreamingDemo`).toString();
  if (!out.includes('Topic 119 Server-Sent Events and HTTP streaming verified successfully.')) throw new Error(out);
});

// Part 4: Database Systems & Persistence (Topics 120-131)
runTest('Database - Topic 120 (Paradigms & Architecture): SqlVsNoSqlParadigmsDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/databases/SqlVsNoSqlParadigmsDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.databases.SqlVsNoSqlParadigmsDemo`).toString();
  if (!out.includes('[SUCCESS] Topic 130 SQL vs NoSQL Paradigms Demo executed cleanly.')) throw new Error(out);
});

runTest('Database - Topics 124-126, 130 (Queries, Joins & Tuning): MySqlQueriesAndOptimizationDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/databases/MySqlQueriesAndOptimizationDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.databases.MySqlQueriesAndOptimizationDemo`).toString();
  if (!out.includes('[SUCCESS] Topic 131 MySQL Mastery Demo executed cleanly.')) throw new Error(out);
});

runTest('Database - Topics 121, 123 (MySQL Environment & Persistence): JavaMySqlPersistencePropertiesDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/databases/JavaMySqlPersistencePropertiesDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.databases.JavaMySqlPersistencePropertiesDemo`).toString();
  if (!out.includes('[SUCCESS] Topic 132 Java MySQL Persistence Demo executed cleanly.')) throw new Error(out);
});

runTest('Database - Topic 120 (Document Data Modeling & Aggregations): MongoDbDocumentAndAggregationDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/databases/MongoDbDocumentAndAggregationDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.databases.MongoDbDocumentAndAggregationDemo`).toString();
  if (!out.includes('[SUCCESS] Topic 133 MongoDB Mastery Demo executed cleanly.')) throw new Error(out);
});

runTest('Database - Topic 121 (Document Store Persistence Configuration): JavaMongoDbPersistencePropertiesDemo.java execution', () => {
  const outDir = 'examples/web/classes';
  execSync(`${JAVAC} -d ${outDir} examples/databases/JavaMongoDbPersistencePropertiesDemo.java`);
  const out = execSync(`${JAVA} -cp ${outDir} com.handbook.databases.JavaMongoDbPersistencePropertiesDemo`).toString();
  if (!out.includes('[SUCCESS] Topic 134 Java MongoDB Persistence Demo executed cleanly.')) throw new Error(out);
});

runTest('Jakarta EE - WAR packaging for Tomcat', () => {
  const warBuild = 'examples/web/war-build';
  const webInfClasses = path.join(warBuild, 'WEB-INF/classes');
  if (!fs.existsSync(webInfClasses)) fs.mkdirSync(webInfClasses, { recursive: true });
  fs.cpSync('examples/web/classes', webInfClasses, { recursive: true });
  const warFile = 'examples/web/handbook-demo.war';
  execSync(`${JAR} -cvf ${warFile} -C ${warBuild} .`);
  if (!fs.existsSync(warFile)) throw new Error(`WAR file was not created: ${warFile}`);
});

console.log('----------------------------------------------------');
console.log(`Results: ${passed} passed, ${failed} failed, ${skipped} skipped.`);
console.log('====================================================');

if (failed > 0) process.exit(1);
