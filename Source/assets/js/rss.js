var Rss = function() {
	var xml = null;
	/*database object */
	//database connection
	var _conn = null;
	//database file
	var _dbfile = null;
	//SQLStatement
	var _stmt = null;

	//sql status
	var _sqlstatus = "";

	//
	var _channelList = null;

	//
	var _itemList = null;

	return {
		init : function() {
			//initial database
			Rss.initDB();
		},
		initDB : function() {
			//initial database
			_dbfile = air.File.applicationDirectory.resolvePath('app:/assets/DB/CRM.db');
			_conn = new air.SQLConnection();
			_conn.addEventListener(air.SQLEvent.OPEN, function(event) {
				_stmt = new air.SQLStatement();
				_stmt.addEventListener(air.SQLErrorEvent.ERROR, function(event) {
					alert('There has been a problem executing a statement:\n' + event.error.message);
				});
				_stmt.sqlConnection = _conn;
				_stmt.text = "";
				_stmt.addEventListener(air.SQLEvent.RESULT, Rss.doStmtResult);
				//_stmt.execute();
			});
			_conn.open(_dbfile, air.SQLMode.CREATE);
		},
		GetXML : function(url, fun) {
			var xml = new XMLHttpRequest();
			xml.open("GET", url, false);
			xml.onreadystatechange = function() {
				if(xml.readyState == 4) // the request is complete
				{
					if(xml.status == 200)
						fun(xml);
				}
			}
			xml.send(null);
		},
		GetChannelTitle : function(turl, fun, err, com) {
			var monitor = new air.URLMonitor(new air.URLRequest(turl));
			monitor.addEventListener(air.StatusEvent.STATUS, function(e) {
				if(!monitor.available) {
					err();
					return false;
				}
			});
			monitor.start();
			try {
				$.ajax({
					type : "get",
					url : turl,
					success : function(data) {
						var title = $(data).find("rss channel>title").text();
						fun(title, turl);
					},
					error : function() {
						err();
					},
					complete : function(XMLHttpRequest, textStatus) {
						com();
					}
				});
			} catch(e) {
				err();
			}
		},
		GetItems : function(turl, fun, err, com) {
			var monitor = new air.URLMonitor(new air.URLRequest(turl));
			monitor.addEventListener(air.StatusEvent.STATUS, function(e) {
				if(!monitor.available) {
					err();
				}
			});
			monitor.start();
			_itemList = new Array();
			$.ajax({
				type : "get",
				url : turl,
				success : function(data) {
					$(data).find("channel>item").each(function(index) {
						_itemList[index] = {};
						_itemList[index].Title = $(this).find("title").text();
						_itemList[index].Link = $(this).find("link").text();
						_itemList[index].PubDate = $(this).find("pubDate").text();
						_itemList[index].Description = $(this).find("description").text();
					});
					fun(_itemList);
				},
				error : function() {
					err();
				},
				complete : function(XMLHttpRequest, textStatus) {
					com();
				}
			});
		},
		InsertRss : function(title, url) {
			_stmt.text = "delete from rss where URL = @URL";
			_stmt.clearParameters();
			_stmt.parameters["@URL"] = url;
			_stmt.execute();
			_stmt.text = "insert into Rss(URL,Title) values(@URL,@Title)";
			_stmt.clearParameters();
			_stmt.parameters["@URL"] = url;
			_stmt.parameters["@Title"] = title;
			_stmt.execute();
		},
		SelectAllRss : function() {
			_sqlstatus = "selectAllChannel";
			_stmt.text = "select * from Rss order by sort";
			_stmt.clearParameters();
			_stmt.execute();
			return _channelList;
		},
		SortRss : function(channelList) {
			_stmt.text = "update rss set Sort = @Sort where URL = @URL";
			for(var i = 0; i < channelList.length; i++) {
				_stmt.clearParameters();
				_stmt.parameters["@Sort"] = Math.round(channelList[i].Sort);
				_stmt.parameters["@URL"] = channelList[i].URL;
				_stmt.execute();
			}
		},
		DelRss : function(RID) {
			_stmt.text = "delete from Rss where RID = @RID";
			_stmt.clearParameters();
			_stmt.parameters["@RID"] = Math.round(RID);
			_stmt.execute();
		},
		UpdateRss : function(RID, title) {
			_stmt.text = "update rss set Title =@Title where RID = @RID";
			_stmt.clearParameters();
			_stmt.parameters["@Title"] = title;
			_stmt.parameters["@RID"] = Math.round(RID);
			_stmt.execute();
		},
		doStmtResult : function() {
			switch(_sqlstatus) {
				case "selectAllChannel":
					var result = _stmt.getResult();
					if(result.data == null) {
						_channelList = null;
					} else {
						_channelList = new Array();
						for(var i = 0; i < result.data.length; i++) {
							_channelList[i] = {};
							_channelList[i].RID = result.data[i]["RID"];
							_channelList[i].Title = result.data[i]["Title"];
							_channelList[i].URL = result.data[i]["URL"];
						}
					}
					break;
			}
		}
	}
}();
