新北市 1999 報表處理程式
====================

將公務雲匯出的 CSV 報表，處理成適合上傳到新北市政府資料開放平台的格式。

安裝
----

0. 先下載 [NodeJS](http://nodejs.org) 並安裝（完全按照預設值即可）。
1. 在 https://github.com/mrorz/ntpc-1999-processor 下載
 ZIP 檔，解壓縮。
2. 點兩下 `INSTALL.bat` 進行安裝。安裝完成後即可刪掉 `INSTALL.bat`。
3. 用「記事本」打開 `lib/config.js` 來做欄位與篩選器設定，存檔。

執行
----
直接將公務雲匯出的 CSV 檔拖曳到 `run.bat` 上，就會在那個 CSV 檔所在的資料夾再產生一個 `xxx.done.csv`；直接去新北市政府資料開放平台上傳此檔即可。

![Imgur](//i.imgur.com/J0Q9ckK.gif)
