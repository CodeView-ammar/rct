# accounting
DjangoOnWindowsWithIISAndSQLServer

# delete migrations -->
find . -path "*/migrations/*.pyc"  -delete && find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/templates/*.pyc"  -delete

find . -path "*/templates/*.html.py"  -delete

find . -path   -name "*.pyc" -delete

جلب ملفات المشفرة
pyarmor build
تحويلها الى pyc
python -m compileall -b
حذف ملفات py 
find /d/training/accounting-master/accounting_build/  -name '*.py' -delete

find /d/training/accounting-master/accounting_build/  -path "*/__pycache__/*.pyc"  -delete
إزالة حميع الحركات في الجداول:

DELETE FROM pos_possalesdetails;
DELETE FROM assets_calcdepreciation;
DELETE FROM assets_asset;
DELETE FROM bond;
DELETE FROM our_core_dataexport;
DELETE FROM our_core_dataimport;
DELETE FROM sales_detailsalesbillreturn;
DELETE FROM sales_detailssalesbillpayment;
DELETE FROM sales_detailssalesbillreturnpayment;
DELETE FROM sales_invoiceqr;
DELETE FROM sales_detailsalesbill;
DELETE FROM sales_salesbill;
DELETE FROM sales_salesbillreturn;
DELETE FROM warehouse_adjustmentsstore;
DELETE FROM warehouse_adjustmentsstoredetail;
DELETE FROM warehouse_incomeorderandbills;
DELETE FROM warehouse_incomeorderdetails;
DELETE FROM warehouse_incomeorder;
DELETE FROM warehouse_iteminventorydetail;
DELETE FROM warehouse_iteminventory;
DELETE FROM warehouse_outgoingorderdetails;
DELETE FROM warehouse_outgoingorder;
DELETE FROM warehouse_storequantity;
DELETE FROM warehouse_transferorderdetails;
DELETE FROM warehouse_transferorder;
DELETE FROM purchase_details_returns;
DELETE FROM purchase_invoicelocal_returns;
DELETE FROM purchase_invoicelocal_details;
DELETE FROM purchase_invoicelocal;
DELETE FROM opening_balances;
DELETE FROM warehouse_openingstore;
DELETE FROM details_daily_entry;
DELETE FROM daily_entries;
DELETE FROM sales_quotationdetail;
DELETE FROM sales_quotation;


تحديث الجديد الخاص بالشركات:
UPDATE accounts SET `company_id`='1';
UPDATE accounts_currency SET `company_id`='1';
UPDATE assets_asset SET `company_id`='1',`branch_id`='1';
UPDATE assets_assetgroup SET `company_id`='1',`branch_id`='1';
UPDATE assets_calcdepreciation SET `company_id`='1',`branch_id`='1';
UPDATE assets_location SET `company_id`='1',`branch_id`='1';
UPDATE bank SET `company_id`='1',`branch_id`='1';
UPDATE bond SET `company_id`='1',`branch_id`='1';
UPDATE bookings_eventbooktemp SET `company_id`='1',`branch_id`='1';
UPDATE bookings_installment SET `company_id`='1',`branch_id`='1';
UPDATE bookings_installmentdetail SET `company_id`='1',`branch_id`='1';
UPDATE bookings_reservehall SET `company_id`='1',`branch_id`='1';
UPDATE bookings_reservehalldetail SET `company_id`='1',`branch_id`='1';
UPDATE borker_accounts SET `company_id`='1',`branch_id`='1';
UPDATE customer_customerdata SET `company_id`='1',`branch_id`='1';
UPDATE daily_entries SET `company_id`='1',`branch_id`='1';
UPDATE details_daily_entry SET `company_id`='1',`branch_id`='1';
UPDATE fund SET `company_id`='1',`branch_id`='1';
UPDATE general_configuration_costcenter SET `company_id`='1',`branch_id`='1';
UPDATE general_ledger_closingbranch SET `company_id`='1',`branch_id`='1';
UPDATE general_ledger_closingyear SET `company_id`='1',`branch_id`='1';
UPDATE opening_balances SET `company_id`='1',`branch_id`='1';
UPDATE our_core_dataexport SET `company_id`='1',`branch_id`='1';
UPDATE our_core_dataimport SET `company_id`='1',`branch_id`='1';
UPDATE our_notifications_notificationvariables SET `company_id`='1';
UPDATE public_administration_accountingstop SET `company_id`='1',`branch_id`='1';
UPDATE public_administration_save_path_backup SET `company_id`='1',`branch_id`='1';
UPDATE purchases_discountcodingpurchases SET `company_id`='1',`branch_id`='1';
UPDATE purchase_details_returns SET `company_id`='1',`branch_id`='1';
UPDATE purchase_invoicelocal SET `company_id`='1',`branch_id`='1';
UPDATE purchase_invoicelocal_details SET `company_id`='1',`branch_id`='1';
UPDATE purchase_invoicelocal_returns SET `company_id`='1',`branch_id`='1';
UPDATE sales_advancedoptions3 SET `company_id`='1',`branch_id`='1';
UPDATE sales_burdensalesoperations SET `company_id`='1',`branch_id`='1';
UPDATE sales_detailsalesbill SET `company_id`='1',`branch_id`='1';
UPDATE sales_detailsalesbillreturn SET `company_id`='1',`branch_id`='1';
UPDATE sales_detailssalesbillpayment SET `company_id`='1',`branch_id`='1';
UPDATE sales_detailssalesbillreturnpayment SET `company_id`='1',`branch_id`='1';
UPDATE sales_invoiceqr SET `company_id`='1',`branch_id`='1';
UPDATE sales_quotation SET `company_id`='1',`branch_id`='1';
UPDATE sales_quotationdetail SET `company_id`='1',`branch_id`='1';
UPDATE sales_salesbill SET `company_id`='1',`branch_id`='1';
UPDATE sales_salesbillreturn SET `company_id`='1',`branch_id`='1';
UPDATE sales_salesdiscountencoding SET `company_id`='1',`branch_id`='1';
UPDATE sales_salesmandata SET `company_id`='1',`branch_id`='1';
UPDATE sales_typesalesbill SET `company_id`='1',`branch_id`='1';
UPDATE sales_typessalesreturn SET `company_id`='1',`branch_id`='1';
UPDATE supplier SET `company_id`='1',`branch_id`='1';
UPDATE supplier_generalvariables SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_adjustmentsstore SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_adjustmentsstoredetail SET `company_id`='1';
UPDATE warehouse_adjustmentstype SET `company_id`='1';
UPDATE warehouse_incomeorder SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_incomeorderandbills SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_incomeorderdetails SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_item SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_itemalternative SET `company_id`='1';
UPDATE warehouse_iteminventory SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_iteminventorydetail SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_itemmovement SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_itempricing SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_openingstore SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_outgoingorder SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_outgoingorderdetails SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_pricetype SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_store SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_storequantity SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_suppliersitems SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_transferorder SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_transferorderdetails SET `company_id`='1',`branch_id`='1';
UPDATE warehouse_warehousebrokeraccounts SET `company_id`='1',`branch_id`='1';

إنشاء pass للmysql server:
Goto "phpmyadmin" folder, find and open "config.inc.php" file
Find the line: $cfg [‘Servers’] [$a] [‘auth_type’] = ‘config’; in “config.inc.php” file.
Change the word $cfg [‘Servers’] [$a] [‘auth_type’] = ‘config’; to $cfg [‘Servers’] [$a] [‘auth_type’] = ‘cookie’; in “config.inc.php” file and Save the changes.
Now open browser and type “localhost/phpmyadmin”. Enter username is “root“. password is null means empty. you don’t type anything leave blank and press GO button.
Now you can see “change password” link. please click that link.
Set your phpMyAdmin password and retype again and press GO button.


source /d/AccountingSystem/accounting-master/accovenv/Scripts/activate  && python manage.py runserver