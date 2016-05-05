 $.extend($.fn.dataTable.defaults, {
        "language": {
        "processing": "正在加载中...", 
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "无数据显示",
        "info": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
        "infoEmpty": "暂无数据",
        "infoFiltered": "(从 _MAX_ 条数据中检索)",
        "search":"搜索",        
        "paginate": {
            "first": "首页",
            "previous": "前一页",
            "next": "后一页",
            "last": "最后一页"
            }
       },
       "order": [[0, "desc"]],
       "autowidth":true
  });



  $.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
      var min = $('#start_date').val();
      var max = $('#last_date').val();
      var time;

      for (key in data) {
        var subdata = data[key];
        if (subdata.match(/[0-9]+-[0-9]+-[0-9]+/)) {
          var time = Date.parse(subdata);
          if (time) {
            min = Date.parse(min);
            max = Date.parse(max);
            if ((isNaN(min) && isNaN(max)) ||
              (isNaN(min) && time < max) ||
              (min < time && isNaN(max)) ||
              (min < time && time < max)) {
              return true;
            } else {
              return false;
            } 
          }
        }
      }

      return true;
    }
  );