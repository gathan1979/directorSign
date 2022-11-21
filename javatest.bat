@echo off
::java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp2\htdocs\directorSign\uploads\\%1" -a  --font-size 10.0 --visible-signature --l2-text 'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}' -llx 335 -lly 780 -urx 565 -ury 830 -ka '%2'  -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"

ping.exe 127.0.0.1 -n 4 > nul
c:\xampp2\htdocs\directorSign\SendKeys.exe "Token Logon" "xari!2#4{ENTER}"