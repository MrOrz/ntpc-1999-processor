module.exports = {

  // 列出要保留的欄位。
  // A欄請填0，B欄請填1，C欄請填2，以此類推。
  //
  columns: [0, 7, 8, 9, 10, 12, 14, 15, 17, 19],

  // 列出篩選條件。可以設定多個條件，滿足任一條件就會被保留下來。
  //
  filters: [
    /*{
      // col：用來篩選的欄位。A欄請填0，B欄請填1，C欄請填2，以此類推。
      // values：列出符合條件的值。當欄位的值是列出內容其中之一，就會被保留下來。
      //
      col: 7,
      values: ['路面坑洞', '路燈不亮', '路面坑洞', '交通號誌故障', '鄰里無主垃圾清運'],
    },*/
  ],

  // 要排序的欄位。注意此欄號為「保留欄位」的欄號。如要用來排序的欄是所有要保留的欄位中的第 i 個，
  // 在這裡請填 i-1。
  //
  sortWithColumn: 0,

  // 一開始要跳過的列數。
  //
  rowsToSkip: 4,

  // 附在產生檔案的表頭資料。
  //
  prependData: [
    ['service_request_id','group','service_name','address','description','requested_datetime','updated_datetime1','status_notes1','updated_datetime2','status_notes2'],
    ['案號','案件名稱','案件次類別','反映地點','反映內容','簽收時間','辦理時間','第一階段處理說明','第二階段辦理時間','第二階段處理說明']
  ],

  // 要輸出檔案格式。
  // 可接受值：'csv', 'xlsx'
  //
  outputFormats: ['xlsx']
};
