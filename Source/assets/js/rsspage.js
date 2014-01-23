/**
 * @author wangsg
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
var RID = "";
var CName = "";
$(function() {

	Rss.init();
	ReChannel();

	//ui
	InitUI();
	InitChannel();
	InitItem();
	$(window).resize(function() {
		var halfW = $("#loading")[0].offsetWidth;
		var halfH = $("#loading")[0].offsetHeight;

		var halfW_ = $("#prompt")[0].offsetWidth;
		var halfH_ = $("#prompt")[0].offsetHeight;
		$("#loading").css({
			"top" : (window.nativeWindow.height - halfH) / 2 + "px",
			"left" : (document.body.offsetWidth - halfW) / 2 + "px"
		});
		$("#rssContentList").css({
			"height" : (window.nativeWindow.height - 140) + "px"
		});

		$("#leftBar").css({
			"height" : (window.nativeWindow.height - 100) + "px"
		});
		$("#prompt").css({
			"top" : (window.nativeWindow.height - halfH_) / 2 + "px",
			"left" : (document.body.offsetWidth - halfW_) / 2 + "px"
		});
	});
	window.nativeWindow.addEventListener(air.Event.CLOSING, appClosing);
});
function ShowLoadingDialog() {
	$("#marks").show();
	$("#loading").show();
	var halfW = $("#loading")[0].offsetWidth;
	var halfH = $("#loading")[0].offsetHeight;
	$("#loading").css({
		"top" : (window.nativeWindow.height - halfH) / 2 + "px",
		"left" : (window.nativeWindow.width - halfW) / 2 + "px"
	});
}

function HideLoadingDialog() {
	$("#loading").fadeOut(300);
	$("#marks").hide();
}

function InitUI() {
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
	$("#moveBar").bind("mouseleave", function() {
		$(this).css({
			"background-color" : "#EBEFF9",
			"color" : "#C2CFF1"
		});
	});
	$("#moveBar").bind("mouseenter", function() {
		$(this).css({
			"background-color" : "#C2CFF1",
			"color" : "#fff"
		});
	});
	$("#moveBar").bind("click", function() {
		if($(this).attr("flag") == "0") {
			$("#leftBar").hide();
			$("#rssContentHeader,#rssContent").css({
				"margin-left" : "10px"
			});
			$(this).attr("flag", "1");
		} else {
			$("#leftBar").show();
			$("#rssContentHeader,#rssContent").css({
				"margin-left" : "160px"
			});
			$(this).attr("flag", "0");
		}

	});
	$("#menu div").bind("mouseenter", function() {
		$(this).css({
			"background-color" : "#C2CFF1"
		});
	});
	$("#menu div").bind("mouseleave", function() {
		$(this).css({
			"background-color" : "#fff"
		});
	});
	$("#menu").bind("mouseleave", function() {
		$(this).hide();
	});
	$("#leftBar").sortable();
	$("#leftBar").disableSelection();
	$("#rssContentList").css({
		"height" : (window.nativeWindow.height - 140) + "px"
	});

	$("#leftBar").css({
		"height" : (window.nativeWindow.height - 100) + "px"
	});
}

//初始化左侧频道列表
function InitChannel() {
	$(".channel").unbind();
	$(".channel span").unbind();
	$(".channel").bind("mouseenter", function() {
		if($(this).attr("flag") != "1") {
			$(this).css({
				"-webkit-box-shadow" : " 0px 0px 5px #bbb"
			});
		}
		$(this).find("span").show();
	});
	$(".channel span").bind("mouseleave", function() {
		$(this).css({
			"color" : "#C2CFF1",
			"background-color" : "#fff"
		});
	});
	$(".channel span").bind("mouseenter", function() {
		$(this).css({
			"color" : "#fff",
			"background-color" : "#C2CFF1"
		});
	});
	$(".channel span").bind("mouseenter", function() {
		$(this).css({
			"color" : "#fff",
			"background-color" : "#C2CFF1"
		});
	});
	$(".channel span").bind("click", function(event) {
		event.stopPropagation();
		$("#menu").show();
		var offset = $(this).offset();
		$("#menu").css({
			"top" : offset.top + "px",
			"left" : offset.left + "px"
		});
		RID = $(this).parent()[0].id.split("_")[1];
		CName = $(this).parent().text().replace("▼", "");
	});
	$(".channel").bind("mouseleave", function() {
		if($(this).attr("flag") != "1") {
			$(this).css({
				"-webkit-box-shadow" : "none"
			});
		}
		$(this).find("span").hide();
	});
	$(".channel").bind("click", function() {
		$(".channel").attr("flag", 0);
		$(".channel").css({
			"-webkit-box-shadow" : "none",
			"background" : "-webkit-gradient(linear, 0 0, 0 100%, from(#FAFBFC), to(#EEF2F7))"
		});
		$(this).attr("flag", 1);
		$(this).css({
			"-webkit-box-shadow" : "0px 0px 5px #bbb",
			"background" : "-webkit-gradient(linear, 0 0, 0 100%, from(#DCEBFC), to(#C3DCFC))"
		});

		//
		ReItem($(this).attr("url"));
		$("#rssContentHeader").html($(this).find(">div").html());
	});
}

function InitItem() {
	$(".item").unbind();
	$(".item").bind("click", function() {
		$(".item").css({
			"border" : "none"
		});

		$(this).css({
			"border" : "solid 2px #86A5FA"
		});
		$(this).find(".itemtitle").css({
			"color" : "#2244BB"
		});
		$(this).find(".itemstatus").hide();
	});
}

function ReChannel() {
	var channelList = Rss.SelectAllRss();
	if(channelList == null)
		return;
	var channelHTML = "";

	for(var i = 0; i < channelList.length; i++) {
		channelHTML += "<div id='channel_" + channelList[i].RID + "' url=\"" + channelList[i].URL + "\" flag=\"0\" class=\"channel\">";
		channelHTML += "<div id='channelTitle_" + channelList[i].RID + "'>" + channelList[i].Title + "</div>";
		channelHTML += "<span>▼</span>";
		channelHTML += "</div>";
	}

	$("#leftBar").html(channelHTML);
}

function ReItem(url) {
	ShowLoadingDialog();
	var itemHTML = "";
	Rss.GetItems(url, function(itemList) {
		for(var i = 0; i < itemList.length; i++) {
			itemHTML += "<div class=\"item\"><div class=\"itemheader\"><div class=\"itemtime\" >";
			itemHTML += DateUtil.Format("yyyy/MM/dd hh:mm:ss", itemList[i].PubDate);
			itemHTML += "</div><div class=\"itemtitle\"><div class=\"itemstatus\">&nbsp;&nbsp;&nbsp;</div><a target=\"_blank\" href=\"";
			itemHTML += itemList[i].Link;
			itemHTML += "\">";
			itemHTML += itemList[i].Title;
			itemHTML += "<div class=\"openurl\">&nbsp;&nbsp;&nbsp;</div></a></div></div><div class=\"itemcontent\">";
			itemHTML += itemList[i].Description;
			itemHTML += "</div><div class=\"itembottom\"></div></div>";
		}
		$("#rssContentList").html(itemHTML);
		InitItem();
		HideLoadingDialog();
	}, function() {
		HideLoadingDialog();
	}, function() {
		HideLoadingDialog();
	});
}

function AddRss() {
	var ourl = $("#txtChannelURL").val();
	ShowLoadingDialog();
	Rss.GetChannelTitle(ourl, function(title, url) {
		if(title.trim() == "") {
			alert("添加失败，请检查网络是否联通或者Rss源是否正确");
			return false;
		}
		Rss.InsertRss(title.trim(), url);
		ReChannel();
		alert("添加成功");
		$("#txtChannelURL").val("");
		InitChannel();
		HideLoadingDialog();
	}, function() {
		alert("添加失败，请检查网络是否联通或者Rss源是否正确");
		$("#txtChannelURL").val("");
		HideLoadingDialog();
	}, function() {
		HideLoadingDialog();
	});
}

function appClosing(event) {
	//alert(event);
	//event.preventDefault();
	var channelList = new Array();
	$("#leftBar").find(".channel").each(function(index) {
		channelList[index] = {};
		channelList[index].URL = $(this).attr("url");
		channelList[index].Sort = index;
	});
	Rss.SortRss(channelList);
}

function ReName() {
	$("#prompt").show();
	var halfW_ = $("#prompt")[0].offsetWidth;
	var halfH_ = $("#prompt")[0].offsetHeight;
	$("#menu").hide();
	$("#promptTxt").val(CName);
	$("#prompt").css({
		"top" : (window.nativeWindow.height - halfH_) / 2 + "px",
		"left" : (window.nativeWindow.width - halfW_) / 2 + "px"
	});
}

function DelChannel() {
	$("#menu").hide();
	if(confirm("取消订阅后将无法恢复，确定要删除吗？")) {
		Rss.DelRss(RID);
		ReChannel();
	}
}

function PromptReName() {
	var cname = $("#promptTxt").val();
	if(cname.trim() == "") {
		alert("频道名不能为空");
		return;
	}
	Rss.UpdateRss(RID, cname);
	$("#channelTitle_" + RID).html(cname);
	$("#prompt").hide();
}

function PromptCancel() {
	$("#prompt").hide();
}