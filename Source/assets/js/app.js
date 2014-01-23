//系统业务逻辑以及数据操作相关
var App = function() {

	/*
	Private Properties
	* */

	/*database object */
	//database connection
	var _conn = null;
	//database file
	var _dbfile = null;
	//SQLStatement
	var _stmt = null;

	//sql status
	var _sqlstatus = "";

	//for userinfo
	var _user = null;

	//for tips
	var _tips = "";

	//for clientgroup
	var _clientGroup = null;

	//for clientgroups
	var _clientGroupList = null;

	//for clientinfo
	var _client = null;

	//for clients
	var _clientList = null;

	//for clientdetialinfo
	var _clientDetail = null;

	//for exist group
	var _clientExistGroupList = null;

	//for users by group
	var _clientIDList = null;

	//for record
	var _userRecordList = null;
	/*
	 Public Methods
	 **/

	return {
		init : function() {
			//initial database
			App.initDB();
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
				_stmt.addEventListener(air.SQLEvent.RESULT, App.doStmtResult);
				//_stmt.execute();
			});
			_conn.open(_dbfile, air.SQLMode.CREATE);
		},
		login : function(usercode, pwd) {
			//sha1 key to upper
			var sha1_pwd = hex_sha1(pwd).toUpperCase();
			
			_user = {};
			_stmt.text = "select a.UID,a.Name,a.RoleType,count(b.CID) as CNUM from Users as a left join clients as b on a.UID = b.UID where LoginCode=@usercode and Pwd=@Pwd and Status='A'";
			_stmt.clearParameters();
			_stmt.parameters["@usercode"] = usercode;
			_stmt.parameters["@Pwd"] = sha1_pwd;
			_sqlstatus = "login";
			_stmt.execute();
			return _user;
		},
		addUser : function(usercode, pwd, name, roleType) {
			var sha1_pwd = hex_sha1(pwd).toUpperCase();

			_stmt.clearParameters();
			_stmt.text = "select UID,Name,RoleType from Users where LoginCode=@usercode ";
			_stmt.parameters["@usercode"] = usercode;
			_sqlstatus = "userexists";
			_stmt.execute();

			//不存在
			if(_user == null) {
				_stmt.clearParameters();
				_stmt.text = "insert into users(UID,Name,RoleType,Pwd,LoginCode) values(null,@name,@roleType,@Pwd,@usercode)";
				_stmt.parameters["@name"] = name;
				_stmt.parameters["@roleType"] = roleType;
				_stmt.parameters["@Pwd"] = sha1_pwd;
				_stmt.parameters["@usercode"] = usercode;
				_sqlstatus = "useradd";
				_stmt.execute();
				return _tips;
				//存在
			} else {
				return "User already exists";
			}
		},
		addClientGroup : function(groupname, UID) {
			_stmt.clearParameters();
			_stmt.text = "select GID from ClientGroups where Name=@name and UID =@uid";
			_stmt.parameters["@name"] = groupname;
			_stmt.parameters["@uid"] = UID;
			_sqlstatus = "clientgroupexists";
			_stmt.execute();

			//不存在
			if(_clientGroup == null) {
				_clientGroup = {};
				_stmt.clearParameters();
				_stmt.text = "insert into ClientGroups(Name,Level,UID) values(@name,@level,@uid)";
				_stmt.parameters["@name"] = groupname;
				_stmt.parameters["@level"] = 0;
				_stmt.parameters["@uid"] = UID;
				_sqlstatus = "clientgroupadd";
				_stmt.execute();
				if(_clientGroup == null)
					return _clientGroup;
				else {
					_stmt.clearParameters();
					_stmt.text = "select GID,Name,Level,UID from ClientGroups where Name=@name and UID =@uid";
					_stmt.parameters["@name"] = groupname;
					_stmt.parameters["@uid"] = UID;
					_sqlstatus = "clientgroupexists";
					_stmt.execute();
					return _clientGroup;
				}
			} else {
				return null;
			}
		},
		selectClientGroups : function(uid) {
			_stmt.clearParameters();
			_stmt.text = "select GID,Name,Level from ClientGroups where UID =@uid order by Level desc ";
			_stmt.parameters["@uid"] = uid;
			_sqlstatus = "selectclientgroups";
			_stmt.execute();
			return _clientGroupList;
		},
		selectExistGroups : function(cid) {
			_stmt.clearParameters();
			_stmt.text = "select a.GID,b.Name from ClientsGroupsRel as a inner join ClientGroups as b on a.GID = b.GID where a.CID = @cid order by b.Level desc";
			_stmt.parameters["@cid"] = Math.round(cid);
			_sqlstatus = "selectexistgroups";
			_stmt.execute();
			return _clientExistGroupList;
		},
		deleteClientGroup : function(gid) {
			_stmt.clearParameters();
			_stmt.text = "delete from ClientGroups where GID =@gid";
			_stmt.parameters["@gid"] = gid;
			_stmt.execute();
			_stmt.clearParameters();
			_stmt.parameters["@gid"] = gid;
			_stmt.text = "delete from ClientsGroupsRel where GID =@gid";
			_stmt.execute();
		},
		sortClientGroups : function(sortObj) {
			var sql = "update clientgroups set Level =@level where GID = @gid";
			for(var i = 0; i < sortObj.length; i++) {
				_stmt.clearParameters();
				_stmt.text = sql;
				_stmt.parameters["@level"] = sortObj[i].Level;
				_stmt.parameters["@gid"] = sortObj[i].GID;
				_stmt.execute();
			}
		},
		addClient : function(clientObj) {
			_stmt.clearParameters();
			_stmt.text = "insert into Clients(Name,Company,Sex,Age,Profession,Scale,Phone,CreateDate,UID,Level) values(@Name,@Company,@Sex,@Age,@Profession,@Scale,@Phone,@CreateDate,@UID,@Level)";
			_stmt.parameters["@Name"] = clientObj.Name;
			_stmt.parameters["@Company"] = clientObj.Company;
			_stmt.parameters["@Sex"] = clientObj.Sex;
			_stmt.parameters["@Age"] = clientObj.Age;
			_stmt.parameters["@Profession"] = clientObj.Profession;
			_stmt.parameters["@Scale"] = clientObj.Scale;
			_stmt.parameters["@Phone"] = clientObj.Phone;
			_stmt.parameters["@CreateDate"] = clientObj.CreateDate;
			_stmt.parameters["@UID"] = Math.round(clientObj.UID);
			_stmt.parameters["@Level"] = Math.round(clientObj.Level);
			_sqlstatus = "addclient";
			_stmt.execute();

		},
		selectAllClients : function(uid) {
			_stmt.clearParameters();
			//_stmt.text = "select * from Clients Where UID = @uid order by Level desc";
			_stmt.text ="select a.* from Clients as a left join (select CID,count(VID) as CCount from VisitRecords group by CID   ) as b on a.CID = b.CID where a.UID = @uid order by a.CreateDate desc,a.Level desc,b.CCount desc";
			_stmt.parameters["@uid"] = uid;
			_sqlstatus = "selectallclients";
			_stmt.execute();
			return _clientList;
		},
		selectClientDetail : function(cid) {
			//_clientDetail
			_stmt.clearParameters();
			_stmt.text = "select * from Clients Where CID = @cid";
			_stmt.parameters["@cid"] = cid;
			_sqlstatus = "selectclientdetail";
			_stmt.execute();
			if(_clientDetail == null) {
				return _clientDetail;
			} else {
				_stmt.clearParameters();
				_stmt.text = "select * from Clientinfos where CID = @cid";
				_stmt.parameters["@cid"] = cid;
				_sqlstatus = "selectclientother";
				_stmt.execute();
				return _clientDetail;
			}
		},
		updateClient : function(clientObj) {
			//修改主表信息
			_stmt.clearParameters();
			_stmt.text = "update clients set Name =@Name,Company=@Company,Sex =@Sex,Age=@Age,Profession=@Profession,CreateDate=@CreateDate,Scale=@Scale,Phone=@Phone,Level = @Level where CID = @CID";
			_stmt.parameters["@Name"] = clientObj.Name;
			_stmt.parameters["@Company"] = clientObj.Company;
			_stmt.parameters["@Sex"] = clientObj.Sex;
			_stmt.parameters["@Age"] = clientObj.Age;
			_stmt.parameters["@Profession"] = clientObj.Profession;
			_stmt.parameters["@Scale"] = clientObj.Scale;
			_stmt.parameters["@Phone"] = clientObj.Phone;
			_stmt.parameters["@CreateDate"] = clientObj.CreateDate;
			_stmt.parameters["@CID"] = Math.round(clientObj.CID);
			_stmt.parameters["@Level"] = Math.round(clientObj.Level);
			_stmt.execute();
			//修改从表信息
			//先删除原始记录
			_stmt.clearParameters();
			_stmt.text = "delete from clientInfos where CID = @CID";
			_stmt.parameters["@CID"] = Math.round(clientObj.CID);
			_stmt.execute();
			//增加新记录
			for(var i = 0; i < clientObj.Other.length; i++) {
				_stmt.clearParameters();
				_stmt.text = "insert into ClientInfos(CID,Name,Value) Values(@CID,@Name,@Value)";
				_stmt.parameters["@CID"] = Math.round(clientObj.CID);
				_stmt.parameters["@Name"] = clientObj.Other[i].Key;
				_stmt.parameters["@Value"] = clientObj.Other[i].Value;
				_stmt.execute();
			}
		},
		updateExistClientGroups : function(groupList) {
			//先删除原始记录
			_stmt.clearParameters();
			_stmt.text = "delete from  ClientsGroupsRel where CID = @cid";
			_stmt.parameters["@cid"] = Math.round(groupList.CID);
			_stmt.execute();

			//插入新纪录
			for(var i = 0; i < groupList.List.length; i++) {
				_stmt.clearParameters();
				_stmt.text = "insert into ClientsGroupsRel(GID,CID) values(@gid,@cid)";
				_stmt.parameters["@cid"] = Math.round(groupList.CID);
				_stmt.parameters["@gid"] = Math.round(groupList.List[i].GID);
				_stmt.execute();
			}
		},
		selectUsersByGroup : function(gid) {
			//先删除原始记录
			_stmt.clearParameters();
			_stmt.text = "select * from ClientsGroupsRel where GID =@gid";
			_stmt.parameters["@gid"] = Math.round(gid);
			_sqlstatus = "selectUsersbygroup";
			_stmt.execute();
			return _clientIDList;
		},
		selectUserRecords : function(CID) {
			_stmt.clearParameters();
			_stmt.text = "select * from VisitRecords where CID = @cid";
			_stmt.parameters["@cid"] = Math.round(CID);
			_sqlstatus = "selectuserrecords";
			_stmt.execute();
			return _userRecordList;
		},
		deleteUserRecord : function(vid) {
			_stmt.clearParameters();
			_stmt.text = "delete from VisitRecords where VID = @vid";
			_stmt.parameters["@vid"] = Math.round(vid);
			_stmt.execute();
		},
		insertUserRecord : function(recordObj) {
			_stmt.clearParameters();
			_stmt.text = "insert into VisitRecords(CallDate,Intention,HoldStock,Des,CID) Values(@CallDate,@Intention,@HoldStock,@Des,@CID)";
			_stmt.parameters["@CallDate"] = recordObj.CallDate;
			_stmt.parameters["@Intention"] = recordObj.Intention;
			_stmt.parameters["@HoldStock"] = recordObj.HoldStock;
			_stmt.parameters["@Des"] = recordObj.Des;
			_stmt.parameters["@CID"] = Math.round(recordObj.CID);
			_stmt.execute();
		},
		deleteClient : function(CID) {
			_stmt.clearParameters();
			_stmt.text = "delete from Clients where cid = @cid";		
			_stmt.parameters["@cid"] = Math.round(CID);
			_stmt.execute();
			_stmt.text = "delete from ClientInfos where CID = @cid";
			_stmt.execute();
			_stmt.text = "delete from ClientsGroupsRel where CID = @cid";
			_stmt.execute();
			_stmt.text = "delete from VisitRecords where CID = @cid";
			_stmt.execute();
		},
		formatSQL : function(sql, params) {
			for(var i = 0; i < params.length; i++) {
				var val = params[i].value.toString();
				sql = sql.replace("@" + params[i].key, val.replace("'", ""));
			}
			return sql;
		},
		trim : function(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		doStmtResult : function() {
			switch(_sqlstatus) {
				case "login":
					var result = _stmt.getResult();
					if(result.data == null) {
						_user = null;
					} else {
						_user.UID = result.data[0]["UID"];
						_user.Name = result.data[0]["Name"];
						_user.RoleType = result.data[0]["RoleType"];
						_user.CNUM = result.data[0]["CNUM"];
					}
					break;
				case "userexists":
					var result = _stmt.getResult();
					if(result.data == null) {
						_user = null;
					} else {
						_user = {};
						_user.UID = result.data[0]["UID"];
						_user.Name = result.data[0]["Name"];
						_user.RoleType = result.data[0]["RoleType"];
					}
					break;
				case "useradd":
					var result = _stmt.getResult();
					var count = Math.round(result.rowsAffected);
					if(count == 1)
						_tips = "Added successfully ";
					else
						_tips = "Add failure";
					break;
				case "clientgroupexists":
					var result = _stmt.getResult();
					if(result.data == null) {
						_clientGroup = null;
					} else {
						_clientGroup = {};
						_clientGroup.GID = result.data[0]["GID"];
						_clientGroup.Name = result.data[0]["Name"];
						_clientGroup.Level = result.data[0]["Level"];
					}
					break;
				case "clientgroupadd":
					var result = _stmt.getResult();
					var count = Math.round(result.rowsAffected);
					if(count != 1)
						_clientGroup = null;

					break;
				case "selectclientgroups":
					var result = _stmt.getResult();
					if(result.data == null)
						_clientGroupList = null;
					else {
						_clientGroupList = new Array();
						for(var i = 0; i < result.data.length; i++) {
							_clientGroupList[i] = {};
							_clientGroupList[i].GID = result.data[i]["GID"];
							_clientGroupList[i].UID = result.data[i]["UID"];
							_clientGroupList[i].Name = result.data[i]["Name"];
							_clientGroupList[i].Level = result.data[i]["Level"];
						}
					}
					break;
				case "addclient":

					break;
				case "selectallclients":
					_clientList = new Array();
					var result = _stmt.getResult();
					if(result.data == null)
						_clientList = null;
					else {
						_clientList = new Array();
						for(var i = 0; i < result.data.length; i++) {
							_clientList[i] = {};
							_clientList[i].CID = result.data[i]["CID"];
							_clientList[i].Name = result.data[i]["Name"];
							_clientList[i].Company = result.data[i]["Company"];
							_clientList[i].Des = result.data[i]["Des"];
							_clientList[i].Sex = result.data[i]["Sex"];
							_clientList[i].Age = result.data[i]["Age"];
							_clientList[i].Profession = result.data[i]["Profession"];
							_clientList[i].Scale = result.data[i]["Scale"];
							_clientList[i].CreateDate = result.data[i]["CreateDate"];
							_clientList[i].Phone = result.data[i]["Phone"];
							_clientList[i].Level = result.data[i]["Level"];
						}
					}
					break;
				case "selectclientdetail":
					_clientDetail = {};
					var result = _stmt.getResult();
					if(result.data == null)
						_clientDetail = null;
					else {
						_clientDetail.CID = result.data[0]["CID"];
						_clientDetail.Name = result.data[0]["Name"];
						_clientDetail.Company = result.data[0]["Company"];
						_clientDetail.Des = result.data[0]["Des"];
						_clientDetail.Sex = result.data[0]["Sex"];
						_clientDetail.Age = result.data[0]["Age"];
						_clientDetail.Profession = result.data[0]["Profession"];
						_clientDetail.Scale = result.data[0]["Scale"];
						_clientDetail.CreateDate = result.data[0]["CreateDate"];
						_clientDetail.Phone = result.data[0]["Phone"];
						_clientDetail.Level = result.data[0]["Level"];
					}
					break;
				case "selectclientother":
					_clientDetail.Other = new Array();
					var result = _stmt.getResult();
					if(result.data == null)
						_clientDetail.Other = null;
					else {
						for(var i = 0; i < result.data.length; i++) {
							_clientDetail.Other[i] = {};
							_clientDetail.Other[i].Key = result.data[i]["Name"];
							_clientDetail.Other[i].Value = result.data[i]["Value"];
						}
					}
					break;
				case "selectexistgroups":
					_clientExistGroupList = new Array();
					var result = _stmt.getResult();
					if(result.data == null) {
						_clientExistGroupList = null;
					} else {
						for(var i = 0; i < result.data.length; i++) {
							_clientExistGroupList[i] = {};
							_clientExistGroupList[i].GID = result.data[i]["GID"];
							_clientExistGroupList[i].Name = result.data[i]["Name"];
						}
					}
					break;
				case "selectUsersbygroup":
					_clientIDList = new Array();
					var result = _stmt.getResult();
					if(result.data == null) {
						_clientIDList = null;
					} else {
						for(var i = 0; i < result.data.length; i++) {
							_clientIDList[i] = result.data[i]["CID"];
						}
					}
					break;
				case "selectuserrecords":
					_userRecordList = new Array();
					var result = _stmt.getResult();
					if(result.data == null) {
						_userRecordList = null;
					} else {
						for(var i = 0; i < result.data.length; i++) {
							_userRecordList[i] = {};
							_userRecordList[i].VID = result.data[i]["VID"];
							_userRecordList[i].CallDate = result.data[i]["CallDate"];
							_userRecordList[i].Intention = result.data[i]["Intention"];
							_userRecordList[i].HoldStock = result.data[i]["HoldStock"];
							_userRecordList[i].Des = result.data[i]["Des"];
						}
					}
					break;
				default:
					break;
			}
		}
	}
}();
