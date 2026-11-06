-- -------------------------------------------------------------
-- Apex Digital Banking System - Multi-Database Provisioning
-- -------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `account_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `transaction_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `payment_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS `fraud_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant privileges for standard root / banking user
GRANT ALL PRIVILEGES ON `account_db`.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON `transaction_db`.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON `payment_db`.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON `fraud_db`.* TO 'root'@'%';

FLUSH PRIVILEGES;
