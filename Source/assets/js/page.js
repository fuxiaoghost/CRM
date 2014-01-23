//滑动并发控制
var sSucceed = true;
//用户登录凭证
var UID = "0";
//权限类型
var RoleType = "";
//弹出框ID
var modalDialogID = "";
//客户ID，用来判断新增还是修改
var CID = "";
//已选定分组
var GID = "";
//已选定姓名首字符
var Letter = "";

$(function() {
	InitUI();
	$(window).resize(function() {
		$("#cbottom-list").css("width", $("#cbottom")[0].clientWidth - 48 + "px");
		CheckBottomScroll();
		var halfW = $("#"+modalDialogID)[0].offsetWidth;
		var halfH = $("#"+modalDialogID)[0].offsetHeight;
		if(modalDialogID != "") {
			$("#"+modalDialogID).css({
				"top" : (document.body.offsetHeight - halfH) / 2 + "px",
				"left" : (document.body.offsetWidth - halfW) / 2 + "px"
			});
		}
		$("#ctoolbar").css({
			"margin-left" : $("#ccontent")[0].offsetWidth - 23 + 31 + "px",
			"width" : "20px"
		});

		$("#toolcontent").css("width", $("#ccontent")[0].offsetWidth - 23 + "px");

	});
	//暂时隐藏
	ShowModalDialog("login");

	$("#clientListContent").css("height", "440px");
	//
	$("#txtLogincode").focus();
});
function CheckBottomScroll() {
	$("#cbottom-left,#cbottom-right").css("visibility", "hidden");
	if($("#cbottom-list")[0].scrollHeight > 30) {
		$("#cbottom-left").css("visibility", "visible");
	}
	if(Math.round($("#cbottom-ul").css("margin-left").replace("px", "")) < 0) {
		$("#cbottom-right").css("visibility", "visible");
	}
}

function ShowModalDialog(id) {
	$("#marks").show();
	$("#" + id).show();
	var halfW = $("#" + id)[0].offsetWidth;
	var halfH = $("#" + id)[0].offsetHeight;

	$("#"+id).css({
		"top" : (document.body.offsetHeight - halfH) / 2 + "px",
		"left" : (document.body.offsetWidth - halfW) / 2 + "px"
	});
	modalDialogID = id;
}

function HideModalDialog() {
	$("#" + modalDialogID).fadeOut(300);
	$("#marks").hide();
}

//隐藏密码框
function HidePwd() {
	$("#marks").hide();
	$("#login").hide();
}

//用户界面初始化
function InitUI() {

	//工具栏显示隐藏按钮
	$("#toolbtn").bind("mouseenter", function() {
		$(this).css("background-color", "#336699");
	});
	$("#toolbtn").bind("mouseleave", function() {
		$(this).css("background-color", "#eee");
	});
	$("#ctoolbar").css({
		"margin-left" : $("#ccontent")[0].offsetWidth - 23 + 31 + "px",
		"width" : "20px"
	});

	$("#toolcontent").css("width", $("#ccontent")[0].offsetWidth - 23 + "px");
	$("#toolbtn").bind("click", function() {
		if(Math.round($("#ctoolbar").css("margin-left").replace("px", "")) > 31) {
			//$("#ctoolbar").css("margin-left", "0px");
			$("#ctoolbar").animate({
				marginLeft : "31px",
				width : $("#ccontent")[0].clientWidth + "px"
			}, 600);
			$("#toolbtn").css("background-image", "url(assets/images/rightarrow-4x7.png)");
		} else {
			//$("#ctoolbar").css("margin-left", $("#ccontent")[0].offsetWidth - 23 + "px");
			$("#ctoolbar").animate({
				marginLeft : $("#ccontent")[0].offsetWidth - 23 + 31 + "px",
				width : "20px"
			}, 600);
			$("#toolbtn").css("background-image", "url(assets/images/leftarrow-4x7.png)");
		}
	});
	//工具栏上面按钮
	$("#toolcontent table td[id]").bind("mouseenter", function(event) {
		event.stopPropagation();
		$(this).css("background-color", "#336699");
	});
	$("#toolcontent table td[id]").bind("mouseleave", function(event) {
		event.stopPropagation();
		$(this).css("background-color", "#eee");
	});
	//添加分组
	$("#tdAddGroup").bind("click", function() {
		//item样式
		InitItem();
		ShowModalDialog("addGroupPanel");
		ShowClientGroups();
		//收起工具栏
		$("#toolbtn").trigger("click");
	});
	//添加用户
	$("#tdAddUser").bind("click", function() {

		//用户信息item
		InitUserItem();
		//隐藏附加信息
		CID = "";
		//置空，表示为新增
		$("#userOtherInfo").hide();
		//清空输入框内容
		$("#txtUserName").val("");
		$("#txtUserPhone").val("");
		$("#txtUserSex").val("");
		$("#txtUserAge").val("");
		$("#txtUserProfession").val("");
		$("#txtUserScale").val("");
		$("#txtUserCompany").val("");
		$("#txtUserCreateData").val("");
		$("#seleUserLevel").val(0);
		ShowModalDialog("addUser");
		//收起工具栏
		$("#toolbtn").trigger("click");
	});
	//RSS新闻
	$("#tdNews").bind("click", function() {
		var init = new air.NativeWindowInitOptions();
		var bounds = null;
		var win = null;
		var login = air.File.applicationDirectory.resolvePath('Rss.html');
		var width = 400;		
		var height = 600;
		bounds = new air.Rectangle((air.Capabilities.screenResolutionX - width ) / 2, (air.Capabilities.screenResolutionY - height ) / 2, width, height);
		init.minimizable = true;
		init.maximizable = true;
		init.resizable = true;
		win = air.HTMLLoader.createRootWindow(true, init, false, bounds);
		win.load(new air.URLRequest(login.url));
	});
	//按钮样式
	$(".btn").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #999999",
			"background-color" : "#dadada",
			"color" : "#212121"
		});
	});
	$(".btn").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px #D3D3D3",
			"background-color" : "#e6e6e6",
			"color" : "#555555"
		});
	});
	//弹框关闭按钮样式
	$(".dialogClose").bind("mouseenter", function() {
		$(this).css({
			"background-color" : "#F6F6F6",
			"border" : "solid 1px #ccc"
		});
	});
	$(".dialogClose").bind("mouseleave", function() {
		$(this).css({
			"background-color" : "transparent",
			"border" : "solid 1px transparent"
		});
	});
	//弹框关闭按钮事件
	$(".dialogClose").bind("click", function() {
		$(this).parent().parent().fadeOut(400);
		$("#marks").hide();
	});
	//左侧分类按钮
	$("#cleft-ul li,#cbottom-ul li").bind("mouseenter", function() {
		if($(this).attr("flag") != "on") {
			$(this).css({
				"border" : "solid 1px #FBCB09",
				"background-color" : "#FDF5CE",
				"color" : "#C77405"
			});
		}
	});
	$("#cleft-ul li,#cbottom-ul li").bind("mouseleave", function() {
		if($(this).attr("flag") != "on") {
			$(this).css({
				"border" : "solid 1px #CCC",
				"background-color" : "#F6F6F6",
				"color" : "#1C94C4"
			});
		}
	});
	$("#cleft-ul li").bind("click", function() {
		$("#cleft-ul li").css({
			"border" : "solid 1px #CCC",
			"background-color" : "#F6F6F6",
			"color" : "#1C94C4",
			"margin-left" : "13px"
		});
		$("#cleft-ul li").attr("flag", "off");
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"background-color" : "#FDF5CE",
			"color" : "#C77405",
			"border-right" : "none",
			"margin-left" : "16px"
		});
		$(this).attr("flag", "on");

		if(App.trim($(this).html()) == "*")
			Letter = "";
		else {
			Letter = App.trim($(this).html());
		}

		//筛选
		Search();
	});
	$("#cbottom-left").bind("click", function() {
		CheckBottomScroll();
		if(!sSucceed)
			return;
		sSucceed = false;
		var ml = 0;
		var s = 2;
		var ol = Math.round($("#cbottom-ul").css("margin-left").replace("px", ""));
		var nobj = $("#cbottom-ul li[sflag='1']")[0];
		if(nobj) {
			ml = nobj.offsetWidth;
			if($(nobj).next().length > 0) {
				$("#cbottom-ul li").attr("sflag", "0");
				$(nobj).next().attr("sflag", "1");
			}
		} else {
			ml = $("#cbottom-ul li").eq(0)[0].offsetWidth;
			if($("#cbottom-ul li").eq(1).length > 0) {
				$("#cbottom-ul li").attr("sflag", "0");
				$("#cbottom-ul li").eq(1).attr("sflag", "1");
			}
		}
		if(ml == 0) {
			s = 0;
		}

		$("#cbottom-ul").animate({
			marginLeft : ol - ml - s
		}, 200, "linear", function() { CheckBottomScroll();
			sSucceed = true;
		});
	});
	$("#cbottom-right").bind("click", function() {
		CheckBottomScroll();
		if(!sSucceed)
			return;
		sSucceed = false;
		var ml = 0;
		var s = 2;
		var ol = Math.round($("#cbottom-ul").css("margin-left").replace("px", ""));
		var pobj = $("#cbottom-ul li[sflag='1']")[0];
		if($(pobj).prev().length > 0) {
			ml = $(pobj).prev()[0].offsetWidth;
			$("#cbottom-ul li").attr("sflag", "0");
			$(pobj).prev().attr("sflag", "1");
		}
		if(ml == 0) {
			s = 0;
		}

		$("#cbottom-ul").animate({
			marginLeft : ol + ml + s
		}, 200, "linear", function() { CheckBottomScroll();
			sSucceed = true;
		});
	});
	$("#cbottom-list").css("width", $("#cbottom")[0].clientWidth - 48 + "px");
	CheckBottomScroll();
}

//初始化item
function InitItem() {
	//Item样式
	$(".item").unbind();
	$(".item").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"background-color" : "#FDF5CE",
			"color" : "#C77405"
		});
	});
	$(".item").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px #ccc",
			"background-color" : "#F6F6F6",
			"color" : "#1C94C4"
		});
	});
	//item删除按钮样式
	$(".itemClose").unbind();
	$(".itemClose").bind("click", function() {
		DelClientGroup(this);
		$(this).parent().fadeOut(300);
	});
	$(".itemClose").bind("mouseenter", function() {
		$(this).css({
			"background-color" : "#F6F6F6",
			"border" : "solid 1px #ccc"
		});
	});
	$(".itemClose").bind("mouseleave", function() {
		$(this).css({
			"background-color" : "transparent",
			"border" : "solid 1px transparent"
		});
	});
	//item排序
	//$("#sortableGroups").sortable();
	$(".sortable").sortable();
	$(".sortable").disableSelection();

	//添加分组完成
	$("#cfmClientGroup").unbind("click");
	$("#cfmClientGroup").bind("click", function() {
		//排序
		SortClientGroups();
		//刷新界面数据
		InitUIData();
		HideModalDialog();
	});
	$("#cacClientGroup").unbind("click");
	$("#cacClientGroup").bind("click", function() {
		//刷新界面
		InitUIData();
		//关闭窗口
		HideModalDialog();
	});
}

//初始化用户列表
function InitClientListItem() {
	$(".listitem").unbind();
	$(".listitemtitle").unbind();
	$(".itemmodify").unbind();
	$(".itemgroup").unbind();
	$(".itemrecord").unbind();
	$(".itemdelete").unbind();

	$(".listitem").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"color" : "#C77405"
		});
	});
	$(".listitem").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px #ddd",
			"background-color" : "#F6F6F6",
			"color" : "#1C94C4"
		});
	});
	$(".itemmodify,.itemgroup,.itemrecord,.itemdelete").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #Fbcb09"
		});
	});
	$(".itemmodify,.itemgroup,.itemrecord,.itemdelete").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px transparent"
		});
	});
	$(".itemmodify").bind("click", function(event) {
		ModifyUserInfo(this, event);
	});
	$(".itemgroup").bind("click", function() {
		ModifyUserGroup(this, event);
	});
	$(".itemrecord").bind("click", function() {
		ModifyRecord(this, event);
	});
	$(".itemdelete").bind("click", function() {
		DeleteClient(this, event);
	})
	$(".listitemtitle").bind("click", function() {
		if($(this).parent().find(".listitemcontent").is(":visible")) {
			$(this).parent().find(".listitemcontent").slideUp(300);
		} else {
			$(".listitemcontent").slideUp(100);
			$(this).parent().find(".listitemcontent").slideDown(300);
			//实时获取用户信息
			var id = this.id.split("_")[1];
			var clientDetail = App.selectClientDetail(id);
			if(clientDetail != null) {
				var detail = "<table class=\"tbUserInfo\" cellpadding=\"0\" cellpadding=\"0\">";
				//基本信息
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">姓名：</td><td class=\"listitemvalue\">" + clientDetail.Name + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">手机：</td><td class=\"listitemvalue\">" + clientDetail.Phone + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">开户意向：</td><td class=\"listitemvalue\">" + clientDetail.Sex + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">年龄：</td><td class=\"listitemvalue\">" + clientDetail.Age + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">佣金：</td><td class=\"listitemvalue\">" + clientDetail.Profession + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">规模：</td><td class=\"listitemvalue\">" + clientDetail.Scale + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">开户券商：</td><td class=\"listitemvalue\">" + clientDetail.Company + "</td></tr>";
				detail += "<tr><td style='text-align:right' calss=\"listitemkey\">认识时间：</td><td class=\"listitemvalue\">" + clientDetail.CreateDate + "</td></tr>";
				//其他信息
				if(clientDetail.Other != null) {
					for(var i = 0; i < clientDetail.Other.length; i++) {
						detail += "<tr><td style='text-align:right' calss=\"listitemkey\">" + clientDetail.Other[i].Key + "：</td><td class=\"listitemvalue\">" + clientDetail.Other[i].Value + "</td></tr>";
					}
				}
				detail += "</table>";

				$(this).parent().find(".listitemcontent").html("");
				$(this).parent().find(".listitemcontent").html(detail);
			}
		}
	});
}

//初始化用户信息Item
function InitUserItem() {
	$(".userInfoDel").unbind();
	$(".userInfoDel").bind("mouseenter", function() {
		$(this).css({
			"background-color" : "#FDF5CE",
			"border" : "solid 1px #FBCB09"
		});
	});
	$(".userInfoDel").bind("mouseleave", function() {
		$(this).css({
			"background-color" : "transparent",
			"border" : "solid 1px transparent"
		});
	});
	$(".userInfoDel").bind("click", function() {
		$(this).parent().parent()[0].removeChild($(this).parent()[0]);
	});
	$("#cacUserInfo").unbind("click");
	$("#cacUserInfo").bind("click", function() {
		$(this).parent().parent().fadeOut(400);
		$("#marks").hide();
	});
	$("#cfmUserInfo").unbind("click");
	$("#cfmUserInfo").bind("click", function() {
		var Client = {};
		Client.Name = $("#txtUserName").val();
		Client.Phone = $("#txtUserPhone").val();
		Client.Sex = $("#txtUserSex").val();
		Client.Age = $("#txtUserAge").val();
		Client.Profession = $("#txtUserProfession").val();
		Client.Scale = $("#txtUserScale").val();
		Client.Company = $("#txtUserCompany").val();
		Client.CreateDate = $("#txtUserCreateData").val();
		Client.UID = UID;
		Client.Level = $("#seleUserLevel").val();
		if(App.trim(Client.Name) == "") {
			alert("Name no empty");
		} else {
			App.addClient(Client);
			//刷新页面
			InitUIData();
			HideModalDialog();
		}
	});
}

function InitBottomItem() {
	//底部分类按钮
	$("#cbottom-ul li").unbind();
	$("#cbottom-ul li").bind("click", function() {
		$("#cbottom-ul li").css({
			"border" : "solid 1px #CCC",
			"background-color" : "#F6F6F6",
			"color" : "#1C94C4",
			"margin-top" : "2px"
		});
		$("#cbottom-ul li").attr("flag", "off");
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"background-color" : "#FDF5CE",
			"color" : "#C77405",
			"border-top" : "none",
			"margin-top" : "-1px"
		});
		$(this).attr("flag", "on");
		if($(this).attr("gid") == "0")
			GID = "";
		else {
			GID = $(this).attr("gid");
		}
		//筛选
		Search();
	});
}

function InitGroupItem() {
	$("#existGroups span,#notExistGroups span").css({
		"border" : "solid 1px transparent",
		"background-color" : "transparent"
	});
	$("#existGroups span,#notExistGroups span").unbind("mouseenter");
	$("#existGroups span,#notExistGroups span").unbind("mouseleave");
	$("#existGroups span,#notExistGroups span").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"background-color" : "#FDF5CE"
		});
	});
	$("#existGroups span,#notExistGroups span").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px transparent",
			"background-color" : "transparent"
		});
	});
	$("#existGroups span").unbind("click");
	$("#existGroups span").bind("click", function() {
		$(this).parent().parent()[0].removeChild($(this).parent()[0]);
		$("#notExistGroups").append("<div id='" + $(this).parent()[0].id + "'>" + $(this).parent().html() + "</div>");
		InitGroupItem();
	});
	$("#notExistGroups span").unbind("click");
	$("#notExistGroups span").bind("click", function() {
		$(this).parent().parent()[0].removeChild($(this).parent()[0]);
		$("#existGroups").append("<div id='" + $(this).parent()[0].id + "'>" + $(this).parent().html() + "</div>");
		InitGroupItem();
	});
}

function InitUserRecord() {
	$(".existRecord div span").unbind();
	$(".existRecord div span").bind("mouseenter", function() {
		$(this).css({
			"border" : "solid 1px #FBCB09",
			"background-color" : "#FDF5CE"
		});
	});
	$(".existRecord div span").bind("mouseleave", function() {
		$(this).css({
			"border" : "solid 1px transparent",
			"background-color" : "transparent"
		});
	});
	$(".existRecord div span").bind("click", function() {
		$(this).parent().slideUp(200);
		var id = $(this).parent()[0].id.split("_")[1];
		//删除记录
		App.deleteUserRecord(id);
	});
}

//业务逻辑相关
$(function() {
	//App初始化
	App.init();

});
//加载初始化数据
function InitUIData() {
	//获取底部分组
	var groupList = App.selectClientGroups(UID);
	$("#cbottom-ul").html("");
	$("#cbottom-ul").append("<li id='liAllGroups' gid='0' sflag=\"0\" flag=\"off\">全部</li>");
	for(var i = 0; i < groupList.length; i++) {
		$("#cbottom-ul").append("<li gid='" + groupList[i].GID + "' sflag=\"0\" flag=\"off\">" + groupList[i].Name + "</li>");
	}
	InitBottomItem();

	//获取全部客户信息
	var clientList = App.selectAllClients(UID);
	$("#clientListContent").html("");
	var item = "";
	if(clientList != null) {
		for(var i = 0; i < clientList.length; i++) {
			item = "<div uname='" + clientList[i].Name + "' cid='" + clientList[i].CID + "' class=\"listitem\">";
			item += "<div id=\"client_" + clientList[i].CID + "\" class=\"listitemtitle\">"
			item += "<span>";
			item += clientList[i].Name;
			item += "</span>";
			item += "<span>";
			item += clientList[i].Phone;
			item += "</span>";
			item += "<span>";
			item += clientList[i].Scale;
			item += "</span>";
			item += "<span>";
			item += clientList[i].CreateDate;
			item += "</span>";
			for(var j = 0; j < Math.round(clientList[i].Level); j++) {
				item += "<span class=\"levelstar\">&nbsp;&nbsp;&nbsp;</span>";
			}
			item += "<span id='clientmodify_" + clientList[i].CID + "' class='itemmodify'></span>";
			item += "<span id='clientgroupmodify_" + clientList[i].CID + "' class='itemgroup'></span>";
			item += "<span id='clientrecordmodify_" + clientList[i].CID + "' class='itemrecord'></span>";
			item += "<span id='clientdelete_" + clientList[i].CID + "' class='itemdelete'></span>";
			item += "</div>"
			item += "<div class=\"listitemcontent\">";
			item += "</div>";
			item += "</div>";
			$("#clientListContent").append(item);
		}
		InitClientListItem();
	}
	$("#liAllGroups").trigger("click");
	$("#liAllLetters").trigger("click");
	$(".clientNumTips").html("客户总数(" + clientList.length + ")");
}

function login(event) {

	//alert( App.addUser('wangsg', 'fuxiao&ghost', '王曙光', 'user'));
	//return;

	if(event != null)
		if(event.keyCode != 13)
			return;
	var usercode = $("#txtLogincode").val();
	var pwd = $("#txtPwd").val();

	if(usercode == "" || pwd == "") {
		alert("用户名或密码不能为空");
		return;
	}

	var user = App.login(usercode, pwd);
	if(user == null || user.UID == null) {
		alert("用户名或密码错误，请重新输入");
	} else {
		UID = user.UID;
		RoleType = user.RoleType;
		$("#hinfo").html("<span class='mainUserName'>" + user.Name + "</span>&nbsp;&nbsp;<span class='clientNumTips'>客户总数(" + user.CNUM + ")</span>");
		var hour = new Date().getHours();
		if(hour >= 0 && hour <= 8) {
			$("#hinfo").append("<span class='smallTips'>早上好，打起精神开始工作了</span>");
		} else if(hour >= 11 && hour <= 13) {
			$("#hinfo").append("<span class='smallTips'>中午了，该去吃饭喽</span>");
		} else if(hour >= 22 && hour <= 23) {
			$("#hinfo").append("<span class='smallTips'>夜深了，该休息了</span>");
		}

		HideModalDialog();
		//加载初始化数据
		InitUIData();
	}
}

function ClearTxtGroup() {
	$("#txtGroup").val("");
	$("#txtGroup").css("color", "#333");
}

function ShowTxtGroup() {
	$("#txtGroup").val("Press Enter to add group");
	$("#txtGroup").css("color", "#ddd");
}

function AddGroup(event) {
	if(event.keyCode != 13) {
		return;
	}
	var gname = $("#txtGroup").val();
	var group = App.addClientGroup(gname, UID);
	ClearTxtGroup();
	if(group == null)
		alert("Add failure group exist or unknown error");
	else {
		var item = "<div class=\"item\" ><span level=\"{1}\" class=\"itemTitle\">{0}</span><span id='cgdel_{2}' class=\"itemClose\"></span></div>";
		$("#groupItems").append(item.replace("{0}",group.Name).replace("{1}", group.Level).replace("{2}", group.GID));
		InitItem();
	}
}

function ShowClientGroups() {
	var groupList = App.selectClientGroups(UID);
	$("#groupItems").html("");
	for(var i = 0; i < groupList.length; i++) {
		var item = "<div class=\"item\" ><span level=\"{1}\" class=\"itemTitle\">{0}</span><span id='cgdel_{2}' class=\"itemClose\"></span></div>";
		$("#groupItems").append(item.replace("{0}",groupList[i].Name).replace("{1}", groupList[i].Level).replace("{2}", groupList[i].GID));
	}
	InitItem();
}

function DelClientGroup(obj) {
	var gid = obj.id.split("_")[1];
	App.deleteClientGroup(gid);
}

function SortClientGroups() {
	var _groupSort = new Array();
	var count = $("#addGroupPanel").find(".item").length;
	$("#addGroupPanel").find(".item").each(function(index) {
		var gid = $(this).find("span[id^='cgdel_']")[0].id.split("_")[1];
		_groupSort[index] = {};
		_groupSort[index].GID = gid;
		_groupSort[index].Level = count - index;
	});
	App.sortClientGroups(_groupSort);
}

function ModifyUserInfo(obj, event) {
	event.stopPropagation();
	var id = obj.id.split("_")[1];
	var clientDetail = App.selectClientDetail(id);
	$("#userOtherInfo").show();
	$("#txtUserName").val(clientDetail.Name);
	$("#txtUserPhone").val(clientDetail.Phone);
	$("#txtUserSex").val(clientDetail.Sex);
	$("#txtUserAge").val(clientDetail.Age);
	$("#txtUserProfession").val(clientDetail.Profession);
	$("#txtUserScale").val(clientDetail.Scale);
	$("#txtUserCompany").val(clientDetail.Company);
	$("#txtUserCreateData").val(clientDetail.CreateDate);
	$("#seleUserLevel").val(clientDetail.Level);
	ShowModalDialog("addUser");

	//$("#userOtherInfo").find(".tbUserInfo")

	var otherInfoHtml = "";
	if(clientDetail.Other != null) {
		for(var i = 0; i < clientDetail.Other.length; i++) {
			otherInfoHtml += "<tr>";
			otherInfoHtml += "<td class=\"userInfoKey\">" + clientDetail.Other[i].Key + "：</td>";
			otherInfoHtml += "<td class=\"userInfoValue\">";
			otherInfoHtml += "<input type=\"text\" class=\"txtbox\" value='" + clientDetail.Other[i].Value + "' />";
			otherInfoHtml += "</td><td class=\"userInfoDel\"></td></tr>";
		}
	}
	$("#userOtherInfo").find(".tbUserInfo").html(otherInfoHtml);

	//先初始化用户信息样式
	InitUserItem();
	//特殊处理
	$("#txtUserOtherInfoKey,#txtUserOtherInfoValue").unbind();
	$("#txtUserOtherInfoKey,#txtUserOtherInfoValue").bind("keydown", function(event) {
		if(event.keyCode == 13) {
			var key = $("#txtUserOtherInfoKey").val();
			var value = $("#txtUserOtherInfoValue").val();
			if(App.trim(key) == "") {
				alert("Key no empty");
			} else {
				var newHtml = "";
				newHtml += "<tr>";
				newHtml += "<td class=\"userInfoKey\">" + key + "：</td>";
				newHtml += "<td class=\"userInfoValue\">";
				newHtml += "<input type=\"text\" class=\"txtbox\" value='" + value + "' />";
				newHtml += "</td><td class=\"userInfoDel\"></td></tr>";
				$("#userOtherInfo").find(".tbUserInfo").append(newHtml);

				//清空输入框
				$("#txtUserOtherInfoKey").val("");
				$("#txtUserOtherInfoValue").val("");
				$("#txtUserOtherInfoKey").focus();
				//重新绑定删除按钮样式
				$(".userInfoDel").unbind();
				$(".userInfoDel").bind("mouseenter", function() {
					$(this).css({
						"background-color" : "#FDF5CE",
						"border" : "solid 1px #FBCB09"
					});
				});
				$(".userInfoDel").bind("mouseleave", function() {
					$(this).css({
						"background-color" : "transparent",
						"border" : "solid 1px transparent"
					});
				});
				$(".userInfoDel").bind("click", function() {
					$(this).parent().parent()[0].removeChild($(this).parent()[0]);
				});
			}
		}
	});
	$("#cacUserInfo").unbind("click");
	$("#cacUserInfo").bind("click", function() {
		$(this).parent().parent().fadeOut(400);
		$("#marks").hide();
	});
	$("#cfmUserInfo").unbind("click");
	$("#cfmUserInfo").bind("click", function() {
		var Client = {};
		Client.CID = Math.round(id);
		Client.Name = $("#txtUserName").val();
		Client.Phone = $("#txtUserPhone").val();
		Client.Sex = $("#txtUserSex").val();
		Client.Age = $("#txtUserAge").val();
		Client.Profession = $("#txtUserProfession").val();
		Client.Scale = $("#txtUserScale").val();
		Client.Company = $("#txtUserCompany").val();
		Client.CreateDate = $("#txtUserCreateData").val();
		Client.UID = Math.round(UID);
		Client.Other = new Array();
		Client.Level = $("#seleUserLevel").val();
		var key = "";
		var value = "";
		$("#userOtherInfo").find(".tbUserInfo").find("tr").each(function(index) {
			key = $(this).find(".userInfoKey").html().replace("：", "");
			value = $(this).find(".txtbox").val();
			Client.Other[index] = {};
			Client.Other[index].Key = key;
			Client.Other[index].Value = value;
			return;
		});
		if(App.trim(Client.Name) == "") {
			alert("Name no empty");
		} else {
			App.updateClient(Client);
			//刷新页面
			InitUIData();
			HideModalDialog();
		}
	});
}

function ModifyUserGroup(obj, event) {
	event.stopPropagation();
	var id = obj.id.split("_")[1];

	var clientGroups = App.selectClientGroups(UID);
	var existClientGroups = App.selectExistGroups(id);

	var existHtml = "";
	if(existClientGroups != null) {
		for(var i = 0; i < existClientGroups.length; i++) {
			existHtml += "<div id='existGroup_" + existClientGroups[i].GID + "'>" + existClientGroups[i].Name + "<span></span></div>"
		}
	}
	var allGroupHtml = "";
	if(clientGroups != null) {
		for(var i = 0; i < clientGroups.length; i++) {
			var exist = false;
			if(existClientGroups != null) {
				for(var j = 0; j < existClientGroups.length; j++) {
					if(Math.round(clientGroups[i].GID) == Math.round(existClientGroups[j].GID)) {
						exist = true;
					}
				}
			}
			if(!exist)
				allGroupHtml += "<div id='existGroup_" + clientGroups[i].GID + "'>" + clientGroups[i].Name + "<span></span></div>"
		}
	}
	$("#existGroups").html(existHtml);
	$("#notExistGroups").html(allGroupHtml);
	InitGroupItem();

	$("#cacMofidyGroup").unbind("click");
	$("#cacMofidyGroup").bind("click", function() {
		HideModalDialog();
	});
	$("#cfmMofidyGroup").unbind("click");
	$("#cfmMofidyGroup").bind("click", function() {
		var ClientList = {};
		ClientList.CID = id;
		ClientList.List = new Array();
		$("#existGroups").find("div").each(function(index) {
			ClientList.List[index] = {};
			ClientList.List[index].GID = this.id.split("_")[1];
			ClientList.List[index].CID = id;
		});
		App.updateExistClientGroups(ClientList);

		//刷新页面
		InitUIData();
		HideModalDialog();
	});
	ShowModalDialog("modifyGroup");
}

function ModifyRecord(obj, event) {
	event.stopPropagation();
	var id = obj.id.split("_")[1];
	$("#txtRecordTime").val("");
	$("#txtRecordStock").val("");
	$("#txtRecordIntention").val("");
	$("#txtRecordRemark").val("");

	//加载记录信息
	var recordList = App.selectUserRecords(id);

	if(recordList != null) {
		var recordhtml = "";
		for(var i = 0; i < recordList.length; i++) {
			recordhtml += "<div id=\"userRecord_" + recordList[i].VID + "\">";
			recordhtml += "<span></span>";
			recordhtml += "<table style=\"margin:0px; padding: 0px;\" cellpadding=\"0\" cellspacing=\"0\">";
			recordhtml += "<tr>";
			recordhtml += "<td style=\" line-height: 18px;text-align: right; vertical-align: top; min-width: 60px; \">通话时间：</td>";
			recordhtml += "<td style=\"line-height: 18px;text-align: left;vertical-align: top;\">" + recordList[i].CallDate + "</td>";
			recordhtml += "</tr><tr>";
			recordhtml += "<td style=\"line-height: 18px;text-align: right; vertical-align: top; min-width: 60px;\">持股：</td>";
			recordhtml += "<td style=\"line-height: 18px;text-align: left;vertical-align: top;\">" + recordList[i].HoldStock + "</td>";
			recordhtml += "</tr><tr>";
			recordhtml += "<td style=\"line-height: 18px;text-align: right; vertical-align: top; min-width: 60px;\">意向：</td>";
			recordhtml += "<td style=\"line-height: 18px;text-align: left;vertical-align: top;\">" + recordList[i].Intention + "</td>";
			recordhtml += "</tr><tr>";
			recordhtml += "<td style=\"line-height: 18px;text-align: right; vertical-align: top; min-width: 60px;\">备注：</td>";
			recordhtml += "<td style=\"line-height: 18px;text-align: left;vertical-align: top;\">" + recordList[i].Des + "</td>";
			recordhtml += "</tr></table></div>";
		}
		$(".existRecord").html(recordhtml);
	} else {
		$(".existRecord").html("");
	}
	InitUserRecord();
	$("#cacAddRecord").unbind();
	$("#cacAddRecord").bind("click", function() {
		HideModalDialog();
	});
	$("#cfmAddRecord").unbind();
	$("#cfmAddRecord").bind("click", function() {
		var UserRecord = {};
		var recordTime = $("#txtRecordTime").val();
		var recordStock = $("#txtRecordStock").val();
		var recordIntention = $("#txtRecordIntention").val();
		var recordRemark = $("#txtRecordRemark").val();
		if(App.trim(recordTime) == "" && App.trim(recordStock) == "" && App.trim(recordIntention) == "" && App.trim(recordRemark) == "") {
			alert("Please keep one no empty");
			return;
		}
		UserRecord.CallDate = recordTime;
		UserRecord.Intention = recordIntention;
		UserRecord.HoldStock = recordStock;
		UserRecord.Des = recordRemark;
		UserRecord.CID = id;
		App.insertUserRecord(UserRecord);
		//刷新页面
		InitUIData();
		HideModalDialog();
	});
	ShowModalDialog("addRecord");
}

function DeleteClient(obj, event) {
	event.stopPropagation();
	var id = obj.id.split("_")[1];
	if(confirm("Do you confirm to delete this client?") == true) {
		App.deleteClient(id);
		InitUIData();
	}
}

function SearchByLetter() {
	Letter = Letter.toLowerCase();
	$("#clientListContent").find(".listitem").each(function() {
		var py = GetInitials($(this).attr("uname"));

		if(py.indexOf(Letter) != 0) {
			$(this).hide();
		}
	});
}

function SearchByGID() {
	//按分组过滤
	var ClientList = App.selectUsersByGroup(Math.round(GID));
	if(ClientList == null)
		ClientList = new Array();
	$("#clientListContent").find(".listitem").each(function() {
		var gcid = $(this).attr("cid");
		var exist = false;
		for(var i = 0; i < ClientList.length; i++) {
			if(ClientList[i] == gcid)
				exist = true;
		}
		if(!exist)
			$(this).hide();
	});
}

function Search() {
	//显示全部
	$("#clientListContent").find(".listitem").show();
	//按首字母过滤
	if(GID == "") {
		SearchByLetter();
		return;
	}
	//按分组过滤
	if( Letter = "") {
		SearchByGID();
		return;
	}
	//双向过滤
	SearchByGID();
	SearchByLetter();
}

function SearchUI() {
	if(event)
		if(event.keyCode != 13)
			return;

	if($("#searchinput").val() == '- Search Products -') {
		$("#searchinput").val('');
		return;
	}
	if(App.trim($("#searchinput").val()) == "")
		return;
	var inWord = GetInitials(App.trim($("#searchinput").val()));

	$("#clientListContent").find(".listitem").each(function() {
		var uname = GetInitials($(this).attr("uname"));
		if(uname.indexOf(inWord) != -1) {
			var offset = $(this).offset();
			var scrollTop_ = $("#clientListContent")[0].scrollTop;

			$("#clientListContent").animate({
				scrollTop : scrollTop_ + offset.top - 74
			}, 600);
			$(this).trigger("mouseover");
			return false;
		}
	});
}