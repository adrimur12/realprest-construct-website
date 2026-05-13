@echo off
echo Syncing website files to docs folder...
copy /Y index.html docs\index.html
copy /Y contact.html docs\contact.html
copy /Y contact.css docs\contact.css
copy /Y styles.css docs\styles.css
copy /Y script.js docs\script.js
xcopy /Y /E /I images docs\images
xcopy /Y /E /I logo docs\logo
echo Done! Now run: git add . && git commit -m "update site" && git push
