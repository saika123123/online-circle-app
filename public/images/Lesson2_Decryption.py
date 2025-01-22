<!DOCTYPE html>
<!-- saved from url=(0103)https://beefplus.center.kobe-u.ac.jp/lms/course/report/submission?idnumber=20243T5072001&reportId=16020 -->
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>課題提出</title>

<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width">
<link href="./Lesson2_Decryption_files/jquery-ui.min.css" rel="stylesheet">
<link href="./Lesson2_Decryption_files/jquery-ui.structure.min.css" rel="stylesheet">
<link href="./Lesson2_Decryption_files/jquery-ui.theme.min.css" rel="stylesheet">
<link href="./Lesson2_Decryption_files/page_import.css" rel="stylesheet">
<script src="./Lesson2_Decryption_files/jquery-3.5.1.min.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/jquery.heightLine.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/jquery-ui.min.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/jquery.ui.touch-punch.min.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/common.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/pages.js.ダウンロード"></script>
<link rel="stylesheet" href="./Lesson2_Decryption_files/magnific-popup.css">
<script src="./Lesson2_Decryption_files/jquery.magnific-popup.min.js.ダウンロード"></script>

<script type="text/javascript">
$(function(){
	$('.movie-popup-link').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 200,
		preloader: false,
		fixedContentPos: false
	});
	$('.flashplayer-popup-link').magnificPopup({
		type:'inline',
		midClick: true,
		mainClass: 'custom-popup-class'
	});

	$('.popup-modal').magnificPopup({
		type: 'inline',
		preloader: false
	});
	$(document).on('click', '.popup-modal-delete', function (e) {
		e.preventDefault();
		$.ajax({
			url:"/lms/course/alldelete/"+ $("#idnumber").val() ,
			success: function(data) {
				$.magnificPopup.close();
			}
		});
	});
	$(document).on('click', '.popup-modal-close', function (e) {
		e.preventDefault();
		$.magnificPopup.close();
	});
});
$(document).ajaxSend(function(evt, request, settings) {
	var cid = document.getElementsByName('_cid')[0];
	if(cid){
		settings.url += (settings.url.match(/\?/) ? "&" : "?") + '_cid=' + cid.defaultValue;
	}
});
</script>

<script>
$(document).ready(function(){
	$('#ctrl_btn_info').on('click', function(e) {
		if($(window).width() > 480){
			$('#ctrl_menu_info').offset({ top: (e.pageY+28), left: e.pageX });
		} else {
			$('#ctrl_menu_info').offset({ top: (e.pageY+23), left: 0 });
		}
		$('#ctrl_menu_notification').hide();
	});
	$('#ctrl_btn_notification').on('click', function(e) {
		if($(window).width() > 480){
			$('#ctrl_menu_notification').offset({ top: (e.pageY+28), left: e.pageX });
		} else {
			$('#ctrl_menu_notification').offset({ top: (e.pageY+23), left: 0});
		}
		$('#ctrl_menu_info').hide();
	});
})

$(document).on('click', function(event) {
	if (!$(event.target).closest('.btnControl').length) {
		$('#ctrl_menu_info').hide();
		$('#ctrl_menu_notification').hide();
		if (!$(event.target).closest('.btnControl.relativeBtn').length) {
			var Opentarget = $(this).find(".control-menu");
			$(Opentarget).hide();
	 	}
	}
});

$(document).keydown(ivnt_keydown);
function ivnt_keydown(e) {
	// ESCAPE key pressed
	if (e.keyCode == 27) {
		$('#ctrl_menu_info').hide();
		$('#ctrl_menu_notification').hide();
		$('.control-menu').hide();
	}
}

var confirmPage = function (idnumber) {
	var msg = "\u672C\u5F53\u306B\u5168\u30B3\u30F3\u30C6\u30F3\u30C4\u3092\u524A\u9664\u3057\u3066\u3088\u308D\u3057\u3044\u3067\u3059\u304B\uFF1F<br>\u203B\u524A\u9664\u3059\u308B\u3068\u5143\u306B\u306F\u623B\u305B\u307E\u305B\u3093\u3002";
	deleteDialog = CommonUtil.createMessageDialog(msg,"auto","auto");
	if($(window).width() < 481){
		deleteDialog = CommonUtil.createMessageDialog(msg,"90%","auto");
	}
	deleteDialog.addBottun("\u524A\u9664\u3059\u308B", null, deleteCourse(idnumber));
	deleteDialog.addBottun("\u30AD\u30E3\u30F3\u30BB\u30EB");
	deleteDialog.open();
};
var deleteCourse = function(param) {
	return function(){
		deleteDialog.close();
		var p = CommonUtil.createProgress("\u30C7\u30FC\u30BF\u51E6\u7406\u4E2D\u3067\u3059");
		p.open();
		url = "/lms/course/alldelete?idnumber=" + param;
		$.ajax({
			url: url,
		}).done(function(result) {
			if(typeof p !== "undefined" && p) {
				p.close();
				p = null;
			}
			location.href = "/lms/course?idnumber=" + param;
		}).fail(function() {
			if(typeof p !== "undefined" && p) {
				p.close();
				p = null;
			}
		});
	}
};

function InfoDetail(event,infoid,idnumber) {

	
	if(typeof progress == "undefined" || progress == null) {
		progress = CommonUtil.createProgress("\u30C7\u30FC\u30BF\u51E6\u7406\u4E2D\u3067\u3059");
		progress.open();
	}

	event.preventDefault();
	var paramUrl = "\/lms\/course\/information\/listdetail";
	if (idnumber != 'null') {
		paramUrl += "?idnumber=" + idnumber;
	}

	$("#informationDtl #informationId").val(infoid);

	var formData = {};
	$($("#informationDtl").serializeArray()).each(function(i, v) {
		formData[v.name] = v.value;
	});

	$(event.currentTarget).find(".info_new_icon").remove();

	$.ajax({
		type : "POST",
		url : paramUrl,
		data : formData,
		dataType : "html",
		cache: false,
	}).done(function(data) {
			$('#info_detail_view2').html(data);

			if($("#info_preview").length == 0){
				CommonFuncMaker.makeCommonAjaxFail()();
			}

			var info_detail_dialog = CommonUtil.createTempleteDialog("info_detail_view2", "90%", 450);
			if($(window).width() > 480){
				info_detail_dialog = CommonUtil.createTempleteDialog("info_detail_view2", 800, 450);
			}
			info_detail_dialog.addBottun("\u9589\u3058\u308B");
			info_detail_dialog.open();
			InfomationOpenCheck();

			
			if(typeof progress !== "undefined" && progress) {
				progress.close();
				progress = null;
			}
	}).fail();

	info_detail_dialog = CommonUtil.createTempleteDialog("info_detail_view2", "90%", 450);
	if($(window).width() > 480){
		info_detail_dialog = CommonUtil.createTempleteDialog("info_detail_view2", 800, 450);
	}
	info_detail_dialog.addBottun("\u9589\u3058\u308B");
	info_detail_dialog.open();

}

function InfomationOpenCheck(){
	if($('#isInformationOpened').val() != null && $('#isInformationOpened').val() == '0'){
		if($('.header-information .header-new-icon').length){
			$('.header-information .header-new-icon').addClass('close-icon');
		}
	}
}
</script>
<style type="text/css">
</style>


<link href="./Lesson2_Decryption_files/report.css" rel="stylesheet">

<link href="./Lesson2_Decryption_files/katex.min.css" rel="stylesheet">

<link href="./Lesson2_Decryption_files/quill.snow.css" rel="stylesheet">

<script src="./Lesson2_Decryption_files/report.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/fileCommon.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/dragAndDrop.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/katex.min.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/quill.min.js.ダウンロード"></script>
<script src="./Lesson2_Decryption_files/quillUtil.js.ダウンロード"></script>
<script>

$(document).ready(function(){

	if($('[name="method"]').val() == "1") {
		_QuillUtil = {
			reportContents: (function () { return new QuillUtil('bodyEditor', true)})(),
			reportSubmissionText: (function () { return new QuillUtil('submissionText', false, Number('10000'), 'submissionTextCount')})(),
		}
	} else {
		_QuillUtil = {
			reportContents: (function () { return new QuillUtil('bodyEditor', true)})(),
		}
	}

	
	
	$('input[name="fileName"]').each(function(){
		this.value = this.value.replace(/&sbquo;/g, ',');
	})


	
	
	if($("#submissionContentsArea").length < 1) {
		$("#submissionArea").prepend($("#add_block").clone().removeAttr("id").css("display", "block"));
	}

	
	var eventSetting = function() {
		FileCommon.setFileSelect("submissionContentsArea", "fileSelectButton", "fileSelectInput", "fileSelectName", "originalFileName");
		FileCommon.setFileClearAdd("submissionContentsArea", "clearfile", "fileadd", "add_block", eventSetting, "dadFileArea");
		var fileCount = $("#submissionArea .submissionContentsArea").length;
		fileCount = fileCount + $("#submissionFileResult .deleteCheck:not(:checked)").length;
		
		if(fileCount >= $("#maxFileCount").val()) {
			var fileover = "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3067\u304D\u308B\u30D5\u30A1\u30A4\u30EB\u6570\u306F1\u500B\u3067\u3059\u3002";
			$('#add_contents_msg').text(fileover);
			$('.fileadd').addClass("disabled");
			$('.fileadd').css('pointer-events' , 'none');
		}
	};

	
	var dragAndDrop = new DandD("fileDadArea", $(".dad_submissionFile").length, function(isOverLimit) {

		
		var fileObj = dragAndDrop.getUploadLatestFiles();

		var fileCount = $("#dad_file_area .dadSubmissionBlock").length;
		fileCount = fileCount + $("#submissionFileResult .deleteCheck:not(:checked)").length;
		for(var i = 0; i < fileObj.length ; i++){
			fileCount += 1;
			if (fileCount > $("#maxFileCount").val()) {
				
				var fileover = "\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3067\u304D\u308B\u30D5\u30A1\u30A4\u30EB\u6570\u306F1\u500B\u3067\u3059\u3002";
				$('#add_upload_msg').text(fileover);
				$('#fileDadArea').addClass("inputErrorField");
				
				dragAndDrop.setFileClear("dadSubmissionBlock", "dad_clearfile");
				return;
			}

			
			var addElement = $("#dad_add_block").clone().removeAttr("id").css("display", "block");
			addElement.find(".dad_originalFileName").val(fileObj[i].name);
			addElement.find(".dad_fileSelectName").text(fileObj[i].name);
			
			$("#dad_file_area").append(addElement);
		}

		
		dragAndDrop.setFileClear("dadSubmissionBlock", "dad_clearfile");
	});
	dragAndDrop.setFileClear("dadSubmissionBlock", "dad_clearfile");

	
	$("#temp-save").click(function() {
		if($("#temp-save").hasClass('disabled')){
			
			return;
		}
		$("#temp-save").addClass('disabled');

		if($('[name="method"]').val() == "1") {
			$('#bodyText').val(_QuillUtil.reportSubmissionText.getJsonData());
			$('#bodyHtml').val(_QuillUtil.reportSubmissionText.getHtmlData());
			$('#reportSubmissionText').val(_QuillUtil.reportSubmissionText.getTextData());
		}

		var formData = new FormData($("#reportSubmissionForm").get()[0]);
		var paramUrl = "/lms/course/report/keep";

		$.ajax({
			type : "POST",
			url : paramUrl,
			data : formData,
			dataType : "json",
			cache: false,
			processData: false,
			contentType : false
		}).done(function(data) {

			if(data.result === true) {

				
				$("#saveDate").text(data.saveDate).parent("div").css("display", "block");

				
				var dialog = CommonUtil.createMessageDialog("\u4E00\u6642\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002");
				if($(window).width() < 481){
					dialog = CommonUtil.createMessageDialog("\u4E00\u6642\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002","90%");
				}
				dialog.addBottun("\u9589\u3058\u308B");
				dialog.open();

				
				$("#inputTextError").text("");
				$("#submissionText").removeClass("inputErrorField");

			} else {

				
				$("#inputTextError").html(data.errorMessage.join("<br />"));
				$("#submissionText").addClass("inputErrorField");
			}
		}).fail(function() {

			
			$("#inputTextError").text("\u4E00\u6642\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");
		});

		
		setTimeout(function(){
			$("#temp-save").removeClass('disabled');
		}, 1000);
	});

	
	$("#report_submission_btn").click(function() {

		
		submitProgressFlag = false;
		var progress = CommonUtil.createProgress("\u30C7\u30FC\u30BF\u51E6\u7406\u4E2D\u3067\u3059");
		progress.open();

		var formData = null;
		if($("#isDragAndDrop").val() === "true") {
			$("#report").remove();
			var formData = new FormData($("#reportSubmissionForm").get()[0]);

			var uploadFiles = dragAndDrop.getUploadFiles();
			var fileCount = $("#dad_file_area .dadSubmissionBlock").length;
			
			for(var i = 0; i < fileCount; i++) {
				if("" !== uploadFiles[i]) {
					formData.append("uploadFiles", uploadFiles[i]);
				}
			}
		} else {
			$("#report_dad").remove();
			var formData = new FormData($("#reportSubmissionForm").get()[0]);
		}

		
		var paramUrl = "/lms/course/report/upload";

		
		$.ajax({
			type : "POST",
			url : paramUrl,
			data : formData,
			dataType : "json",
			processData: false,
			cache: false,
			contentType : false
		}).done(function(resultData) {

			
			var fileIdElements = document.getElementsByName("fileId");
			for(var j = 0; j < fileIdElements.length; j++) {
				fileIdElements[j].value = resultData[j];
			}
		}).always(function() {

			
			dragAndDrop.clear();
			$(".fileSelectInput").val("").attr("files", []);

			
			$('input[name="fileName"]').each(function(){
				this.value = this.value.replace(/,/g, '&sbquo;');
			});
			
			$('input[name="originalFileName"]').each(function(){
				this.value = this.value.replace(/,/g, '&sbquo;');
			});

			if($('[name="method"]').val() == "1") {
				$('#bodyText').val(_QuillUtil.reportSubmissionText.getJsonData());
				$('#bodyHtml').val(_QuillUtil.reportSubmissionText.getHtmlData());
				$('#reportSubmissionText').val(_QuillUtil.reportSubmissionText.getTextData());
			}

			
			$('#reportSubmissionForm').submit();
		});
	});

		
		$(".course_on_report_submission").click(function() {
			var idnumber = $('[name="idnumber"]').val();
			var reportId = document.getElementById("reportId").value;
			var param = {
				reportId:reportId,
				idnumber:idnumber
			};
			$.ajax({
				type : "GET",
				url : "/lms/course/report/submission/log",
				data : param,
				dataType : "html",
				cache: false
			}).done(function(data) {
				//
			}).fail(
				// ログ出力に失敗
			).always(function() {
				// コーストップへ遷移
				window.location.href = "\/lms\/course?idnumber=20243T5072001";
			});
		});

	
	
	var clearBlockDad = function(){};

	
	
	var clearBlock = function(){};

	
	$("#toDragAndDrop").click(function() {
		$("#isDragAndDrop").val("true");
		clearBlockDad();
		$("#report").addClass("contents-hidden");
		$("#report_dad").removeClass("contents-hidden");
		$("#toDragAndDrop").addClass("contents-hidden");
		$("#toSelectFile").removeClass("contents-hidden");
	});
	$("#toSelectFile").click(function() {
		$("#isDragAndDrop").val("false");
		clearBlock();
		$("#report").removeClass("contents-hidden");
		$("#report_dad").addClass("contents-hidden");
		$("#toDragAndDrop").removeClass("contents-hidden");
		$("#toSelectFile").addClass("contents-hidden");
		eventSetting();
	});

	
	if($("#isDragAndDrop").val() === "true") {
		$("#toDragAndDrop").click();
	} else {
		$("#toSelectFile").click();
	}

	
	clearBlockDad = function() {

		
		var element = $("#dad_file_area");
		var fileIdElements = element.find("input[name=fileId]");
		fileIdElements.each(function(index, element) {

			
			var tmpElement = $(element);

			if(tmpElement.val() == "0") {
				tmpElement.closest(".dadSubmissionBlock").find(".dad_clearfile").click();
			}
		});
		// エラーも削除
		$(".errorArea").hide();
	};

	
	clearBlock = function() {

		
		var element = $("#submissionArea");
		var fileIdElements = element.find('input[name="fileId"]');
		fileIdElements.each(function(index, element) {

			
			var tmpElement = $(element);
			if(tmpElement.val() == "0") {
				tmpElement.closest(".submissionContentsArea").find(".clearfile").click();
			}
		});
	};

	eventSetting();

});


var clearMessage = function (){
	var fileCount = $("#submissionArea .submissionContentsArea").length;
	if(fileCount < $("#maxFileCount").val()) {
		$('#add_contents_msg').text("");
		$('.fileadd').removeClass("disabled");
		$('.fileadd').css('pointer-events' , '');
	}
};


var clearUploadMessage = function (){
	var fileCount = $("#dad_file_area .dadSubmissionBlock").length;
	if(fileCount < $("#maxFileCount").val()) {
		$('#add_upload_msg').text("");
		$('#fileDadArea').removeClass("inputErrorField");
	}
};


$(function(){
	 $("input"). keydown(function(e) {
		 if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
			 return false;
		 } else {
			 return true;
		 }
	 });
 });

</script>

<script>
/*<![CDATA[>*/
$(document).ready(function(){

	_QuillUtil.reportContents.setJsonData("{\"ops\":[{\"insert\":\"The image \\\"Secret.bmp\\\" includes a secret figure. Please decrypt it, overwrite your student number, and then encrypt it again.\"},{\"attributes\":{\"header\":3},\"insert\":\"\\n\"},{\"insert\":\"More details will be announced in the lecture.\\n\"},{\"insert\":{\"image\":\"https:\/\/beefplus.center.kobe-u.ac.jp\/lms\/course\/report\/submission_download\/DecryptionAndEncryption.jpg?reportId=16020\u0026idnumber=20243T5072001\u0026downloadFileName=DecryptionAndEncryption.jpg\u0026objectName=2023%2Fa0%2Fac%2Fb1%2Fa0acb15a-7462-4364-abab-0c42557a0b0c\u0026downloadMode=\"}},{\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Note:\"},{\"attributes\":{\"color\":\"#333333\",\"background\":\"transparent\"},\"insert\":\"\u00A0You can download \\\"Secret.bmp\\\" below.\"},{\"attributes\":{\"indent\":1},\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"About submission\"},{\"attributes\":{\"header\":3},\"insert\":\"\\n\"},{\"insert\":\"File format: \\\".bmp\\\" is recommended. Don't use \\\".jpg\\\" because it breaks the encryption.\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"File name: Anything is ok but please include your student number.\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}", 'reference');

});
/*]]>*/
</script>
</head>

<body>
	<div id="contentsWrapper" class="sidemenu-hide clearfix">
		
		<!--サイドメニュー-->
		<div id="sidemenu" class="sidemenu">
	
		<div class="sidemenu-head">
			<div class="sidemenu-logo">
				<a href="https://beefplus.center.kobe-u.ac.jp/portal/home"><img src="./Lesson2_Decryption_files/sidemenu" alt="BEEF+"></a>
			</div>
			<div id="sidemenuClose" class="sidemenu-close-icon"><img src="./Lesson2_Decryption_files/side_close.png" alt=""></div>
		</div>

		
		
		
			<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-lms-color sidemenu-icon lms-icon" href="https://beefplus.center.kobe-u.ac.jp/lms/timetable">HOME</a>
			<span>
			<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-lms-color sidemenu-icon task-icon" href="https://beefplus.center.kobe-u.ac.jp/lms/task">課題・テスト一覧</a>
			</span>
			
			
				<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-lms-color sidemenu-icon online-icon" href="https://beefplus.center.kobe-u.ac.jp/lms/online">授業情報</a>
			
			<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-course-search-color sidemenu-icon search-icon" href="https://beefplus.center.kobe-u.ac.jp/course/search">コース検索</a>
			<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-lms-color sidemenu-icon link-icon" href="https://ventureplus.center.kobe-u.ac.jp/login">BEEF+ Venture</a>
			<a class="sidemenu-link sidemenu-lms-link sidemenu-link-txt sidemenu-lms-color sidemenu-icon link-icon" href="https://beef.center.kobe-u.ac.jp/">BEEF2023</a>
		
		<br>
		
		<br>

		
			
			
			
			
			
			
			
			
			
			
				<div>

	
	<!-- content -->
	<div id="sidemenuPullEdit" class="sidemenu-pull sidemenu-lms-pull">コースコンテンツ</div>
	<div id="sidemenuListEdit">
		<ul class="sidemenu-list">
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;courseContent&#39;);">教材</a>
			</li>
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;report&#39;);">課題</a>
			</li>
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;examination&#39;);">テスト</a>
			</li>
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;questionnaire&#39;);">アンケート</a>
			</li>
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;discussion&#39;);">掲示板</a>
			</li>
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;externalActivity&#39;);">外部活動</a>
			</li>
			
			<li class="sidemenu-list-area">
				<a class="sidemenu-list-colomn sidemenu-list-txt pulldown-close" href="javascript:void(0);" data1="20243T5072001" onclick="sidemenuLinkMaker(this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;), &#39;attendance&#39;);">出席</a>
			</li>
		</ul>
	</div>
</div>
			
			
			
		
		
	</div>

		<!--右カラム-->
		
		
		<!--右カラム-->
		<div id="pageMain" class="page-main">

			<!--ヘッダ-->
			<header id="global-header" class="global-header">

			<div id="page_head" class="page-head clearfix">
				<div id="sidemenuOpen" class="hamburger-icon sidemenu-open">
					<div class="hamburger-line"></div>
					<div class="hamburger-line"></div>
					<div class="hamburger-line"></div>
				</div>
				<div class="btn-left">
					<ul class="page-head-notification-area clearfix">
						
							<li class="header-information">
								<a href="javascript:void(0)" class="btn-header-info btnControl" id="ctrl_btn_info">
									
									<img class="header-img" src="./Lesson2_Decryption_files/head_icon_info.png" title="お知らせ" alt="お知らせ">
								</a>
							</li>
						
						
							<li class="header-notification">
								<a href="javascript:void(0)" class="btn-header-info btnControl" id="ctrl_btn_notification">
									<span class="header-new-icon"></span>
									<img class="header-img" src="./Lesson2_Decryption_files/head_icon_info_bell.png" title="更新通知" alt="更新通知">
								</a>
							</li>
						
					</ul>
				</div>
				<!-- お知らせ一覧 -->
				
					<ul id="ctrl_menu_info" class="header-control-list control-menu break" style="display: none;">
						<li class="header-control-list header-control-color" style="height:auto;">
							<a class="header-control-colomn" data1="29048" data2="20243T5072001" onclick="InfoDetail(event, this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;));" style="height:auto;">
								<span class="info_title">Lesson1 Lecture video</span>
								
							</a>
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							<a class="header-control-colomn" data1="28586" data2="20243T5082001" onclick="InfoDetail(event, this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;));" style="height:auto;">
								<span class="info_title">講義の実施方法（オンライン＋録画）, and Classes in English (recorded)</span>
								
							</a>
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							<a class="header-control-colomn" data1="26297" data2="20241T5261001" onclick="InfoDetail(event, this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;));" style="height:auto;">
								<span class="info_title">体調不良によるインタビュー欠席について</span>
								
							</a>
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							<a class="header-control-colomn" data1="26104" data2="20241T5261001" onclick="InfoDetail(event, this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;));" style="height:auto;">
								<span class="info_title">グループワークとインタビューの提出物について</span>
								
							</a>
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							<a class="header-control-colomn" data1="25839" data2="20241T5261001" onclick="InfoDetail(event, this.getAttribute(&#39;data1&#39;), this.getAttribute(&#39;data2&#39;));" style="height:auto;">
								<span class="info_title">（修正版）グループワークの準備や進行について</span>
								
							</a>
						</li>
						<li class="header-control-list header-control-color">
							<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/lms/course/information/list">お知らせ一覧へ</a>
						</li>
					</ul>
				
				<!-- 更新通知一覧 -->
				
					<ul id="ctrl_menu_notification" class="header-control-list control-menu break" style="display: none;">
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=58768&amp;module=material&amp;action=update&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=417702" style="height:auto;">・資料(10月23日)が更新されました。(2024/10/23 15:44)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=57689&amp;module=material&amp;action=update&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=417688" style="height:auto;">・資料(Oct.16)が更新されました。(2024/10/23 10:29)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=58768&amp;module=material&amp;action=add&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=417682" style="height:auto;">・資料(10月23日)が追加されました。(2024/10/23 10:26)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T3572001&amp;contentId=58455&amp;module=material&amp;action=add&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T3572001%23courseContent&amp;updateInfoId=415319" style="height:auto;">・資料(講義資料(10/21))が追加されました。(2024/10/21 14:30)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5072001&amp;contentId=32596&amp;module=material&amp;action=update&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5072001%23courseContent&amp;updateInfoId=411077" style="height:auto;">・資料(Lesson 3: Image deformation)が更新されました。(2024/10/17 00:00)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=57689&amp;module=material&amp;action=update&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=409070" style="height:auto;">・資料(Oct.16)が更新されました。(2024/10/15 11:31)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=57689&amp;module=material&amp;action=add&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=409050" style="height:auto;">・資料(Oct.16)が追加されました。(2024/10/15 11:23)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T3572001&amp;contentId=29805&amp;module=information&amp;action=add&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T3572001&amp;updateInfoId=407315" style="height:auto;">・お知らせ(10月15日の授業)が追加されました。(2024/10/14 08:00)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5072001&amp;contentId=16020&amp;module=report&amp;action=update&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%2Freport%2Fsubmission%3Fidnumber%3D20243T5072001%26reportId%3D16020&amp;updateInfoId=400080" style="height:auto;">・課題(Report 1: Decryption and Encryption)が更新されました。(2024/10/10 13:00)</a>
								
							
						</li>
						<li class="header-control-list header-control-color" style="height:auto;">
							
							
								
								
									<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo/transition?idnumber=20243T5082001&amp;contentId=57163&amp;module=material&amp;action=add&amp;clickPoint=1&amp;role=STUDENT&amp;url=%2Flms%2Fcourse%3Fidnumber%3D20243T5082001%23courseContent&amp;updateInfoId=404387" style="height:auto;">・資料(Oct. 9)が追加されました。(2024/10/09 16:43)</a>
								
							
						</li>
						<li class="header-control-list header-control-color">
							<a class="header-control-colomn" href="https://beefplus.center.kobe-u.ac.jp/updateinfo">更新通知一覧へ</a>
						</li>
					</ul>
				
				<div class="page-head-navi">
					<ul class="page-head-navi-unordered-list clearfix">
						<li class="page-head-navi-list">
							<a class="page-head-navi-colomn" href="https://beefplus.center.kobe-u.ac.jp/common/support/manual" id="link_to_manual" target="_manual_inquiry_help">マニュアル<br>Manual</a>
						</li>
						<li class="page-head-navi-list">
							<a class="page-head-navi-colomn" href="https://www.istc.kobe-u.ac.jp/services/StandardService/beefplus/faq/" id="link_to_support" target="_manual_inquiry_help">問い合わせ<br>Contacts</a>
						</li>
						<!-- HELP非表示
						<li class="page-head-navi-list">
							<a class="page-head-navi-colomn" href="/common/support/help" id="link_to_help" th:text="#{header.help.label}" target="_manual_inquiry_help"></a>
						</li>
						-->
						<li class="page-head-navi-list">
							<a class="page-head-navi-colomn" href="https://beefplus.center.kobe-u.ac.jp/common/settings/">個人設定<br>Settings</a>
						</li>
						<li class="page-head-navi-list">
							<a class="page-head-navi-colomn" href="https://beefplus.center.kobe-u.ac.jp/logout">サインアウト<br>Signout</a>
						</li>
					</ul>
				</div>
				<div class="page-head-navi-sp">
					<div class="btn-control btnControl relativeBtn">
						<ul class="control-menu" style="display: none;">
							<li class="control-list"><a class="control-menu-colomn" href="https://beefplus.center.kobe-u.ac.jp/common/support/manual" id="link_to_manual" target="_blank">マニュアル<br>Manual</a></li>
							<li class="control-list"><a class="control-menu-colomn" href="https://www.istc.kobe-u.ac.jp/services/StandardService/beefplus/faq/" id="link_to_support" target="_blank">問い合わせ<br>Contacts</a></li>
							<!--　HELP非表示
							<li class="control-list"><a class="control-menu-colomn" href="/common/support/help" id="link_to_help" th:text="#{header.help.label}" target="_blank"></a></li>
							-->
							<li class="control-list"><a class="control-menu-colomn" href="https://beefplus.center.kobe-u.ac.jp/common/settings">個人設定<br>Settings</a></li>
							<li class="control-list"><a class="control-menu-colomn" href="https://beefplus.center.kobe-u.ac.jp/logout">サインアウト<br>Signout</a></li>
						</ul>
					</div>
				</div>
			</div>
		</header>

			<div id="pageContents" class="sidemenu-hide">

				<div class="page-outline">
					<!--ログイン情報-->
					<div>

		<script>
		/*<![CDATA[>*/
		var changeDisplay = function (params) {
			
			if(typeof progress == "undefined" || progress == null) {
				progress = CommonUtil.createProgress("\u30C7\u30FC\u30BF\u51E6\u7406\u4E2D\u3067\u3059");
				progress.open();
			}
			var array = params.split(',');
			url = "/lms/course?idnumber=" + array[0];

			var param = {
				selectDisplayView: array[1]
			};

			$.ajax({
				type : "GET",
				url: url,
				dataType : "html",
				data : param,
				cache: false
			}).done(function(){
			}).always(function() {
				window.location.href = url;
			});
		};

		/*]]>*/
		</script>

		<div class="login-view clearfix">

			
			
				
				<div class="login-view-name bold-txt">雑賀　淳朗 履修者</div>
			

			
			

			
			

			
			
		</div>

		
		
	</div>
				</div>

				<!--ページコンテンツ-->
				<div>

	<div id="report_view">

		<div class="course-header">
			
			<div>
		<div class="course-title-txt">
			<a class="course-info-txt link-txt" href="https://beefplus.center.kobe-u.ac.jp/lms/course?idnumber=20243T5072001&amp;_cid=9434b548-5503-4874-a247-0a681e29a5af">
				
				
					<span>2024 後期</span>
					<span>3T507</span>
					
<!-- 					<th:block th:if="${@courseInfoHolder.getValue().groupCourseList != null && @courseInfoHolder.getValue().subCourseList == null}">
						<th:block th:each="course : ${@courseInfoHolder.getValue().groupCourseList}" th:object="${course}">
							<span th:text="${course.kougicd}"></span>
						</th:block>
					</th:block> -->
<!-- 					<th:block th:if="${@courseInfoHolder.getValue().groupCourseList == null && @courseInfoHolder.getValue().subCourseList != null}">
						<span th:text="${@courseInfoHolder.getValue().kougicd}"></span>
						<th:block th:each="course : ${@courseInfoHolder.getValue().subCourseList}" th:object="${course}">
							<span th:text="${course.kougicd}"></span>
						</th:block>
					</th:block> -->
					<span>画像処理特論</span>
				
			</a>
		</div>
	</div>
			
			<div class="contents-title">
				<div class="contents-title-txt">課題提出</div>
				<div class="highlight-txt">
					<span>※編集後は、ページ下の「確認画面に進む」から確認画面を表示し、最後に「登録する」ボタンをクリックしてください。</span>
				</div>
			</div>

			<div class="course-header-detail">
				
				<div class="contents-detail contents-vertical">
					
					<div class="contents-header contents-header-txt">
						<span class="bold-txt">タイトル</span>
					</div>
					<div class="contents-input-area">
						<div>Report 1: Decryption and Encryption</div>
					</div>
				</div>
				
				<div class="contents-detail contents-vertical">
					
					<div class="contents-header contents-header-txt">
						<span class="bold-txt">内容</span>
					</div>
					<div class="contents-input-area">
						<div id="bodyEditor" class="ql-container ql-snow ql-disabled"><div class="ql-editor" data-gramm="false" contenteditable="false"><h3>The image "Secret.bmp" includes a secret figure. Please decrypt it, overwrite your student number, and then encrypt it again.</h3><p>More details will be announced in the lecture.</p><p><img src="./Lesson2_Decryption_files/DecryptionAndEncryption.jpg"></p><p class="ql-indent-1"><strong>Note:</strong><span style="color: rgb(51, 51, 51); background-color: transparent;">&nbsp;You can download "Secret.bmp" below.</span></p><h3><strong>About submission</strong></h3><ul><li>File format: ".bmp" is recommended. Don't use ".jpg" because it breaks the encryption.</li><li>File name: Anything is ok but please include your student number.</li></ul><p><br></p></div><div class="ql-clipboard" contenteditable="true" tabindex="-1"></div></div>
					</div>
				</div>
				
				<div class="contents-detail contents-vertical">
					
					<div class="contents-header contents-header-txt">
						<span class="bold-txt">添付ファイル</span>
					</div>
					<div class="contents-input-area">
						<div>
							<div class="link-txt downloadFile">Lesson2_Decryption.py</div>
							
							<div class="fileName contents-hidden">Lesson2_Decryption.py</div>
							<div class="objectName contents-hidden">2023/a6/bb/5a/a6bb5aac-a158-43d2-b5ca-b3aae2dd23a8</div>
							<div class="scanStatus contents-hidden">1</div>
						</div>
						<div>
							<div class="link-txt downloadFile">Secret.bmp</div>
							
							<div class="fileName contents-hidden">Secret.bmp</div>
							<div class="objectName contents-hidden">2023/7c/1d/d5/7c1dd5d1-d430-4eff-908a-5c17ca8e3fb7</div>
							<div class="scanStatus contents-hidden">1</div>
						</div>
					</div>
				</div>
				
				<div class="contents-detail contents-vertical">
					
					<div class="contents-header contents-header-txt">
						<span class="bold-txt">提出期間</span>
					</div>
					<div class="contents-input-area">
						<span>2024/10/10 13:00</span>
						<span>～</span>
						<span>2024/10/24 13:20</span>
					</div>
				</div>
				
				<div class="contents-detail contents-vertical">
					
					<div class="contents-header contents-header-txt">
						<span class="bold-txt">期間外提出</span>
					</div>
					<div class="contents-input-area">
						<div>不可</div>
						
					</div>
				</div>
			</div>
		</div>

		
		<div>

		
		<input id="downloadDialogMessage1" type="hidden" value="選択されたファイルはウイルスチェックを完了していません。">
		<input id="downloadDialogMessage2" type="hidden" value="このファイルは暗号化されている為、ウイルス対策ソフトウエアによるチェックが出来ませんでした。">
		<input id="downloadCancelMessage" type="hidden" value="キャンセル">
		<input id="downloadExecMessage" type="hidden" value="ダウンロード">

		<script>

			var downloadFormParts = {};
			downloadFormParts.fileDownload = function(element) {

				
				var targetElement = $(element).parent();
				var downloadFileName = targetElement.find(".fileName").text();
				var objectName = targetElement.find(".objectName").text();

				
				$("#downloadFileName").val(downloadFileName);
				$("#downloadObjectName").val(objectName);

				
				if(typeof(fileDownloadCb) !== "undefined") {
					fileDownloadCb(element);
					downloadFileName = $("#downloadFileName").val();
				}

				
				$("#reportDownloadForm").attr("action", "/lms/course/report/submission_download" + "/" + CommonUtil.makeDownFileName(downloadFileName)).attr("method", "get");

				
				$("#reportDownloadForm").attr("target", "_blank");

				submitProgressFlag = false;
				
				$("#reportDownloadForm").submit();
			};

			downloadFormParts.onClick = function() {
				var me = this;

				var scanStatus = $(this).parent().find(".scanStatus").text();
				

				var confmsg= $("#downloadDialogMessage1").val();
				if(scanStatus === "9") {
					confmsg= $("#downloadDialogMessage2").val();
				}
				if(scanStatus === "9" || scanStatus === "0") {
					var dialog = CommonUtil.createMessageDialog(confmsg);
					if($(window).width() < 481){
						dialog = CommonUtil.createMessageDialog(confmsg,"90%");
					}
					dialog.addBottun($("#downloadCancelMessage").val());
					dialog.addBottun($("#downloadExecMessage").val(), "", function() {
						downloadFormParts.fileDownload(me);
						dialog.close();
					});
					dialog.open();
				}
				
				else {
					downloadFormParts.fileDownload(me);
				}
			};

			downloadFormParts.setClickEvent = function() {
				$(".downloadFile").off("click").click(downloadFormParts.onClick);
			};

			
			CommonUtil.addOnLoad(downloadFormParts.setClickEvent);
		</script>

		<form action="https://beefplus.center.kobe-u.ac.jp/lms/course/report/submission_download/Lesson2_Decryption.py" method="get" id="reportDownloadForm" target="_blank">
			<input type="hidden" name="reportId" value="16020">
			<input type="hidden" name="idnumber" value="20243T5072001">
			<input type="hidden" name="downloadFileName" value="Lesson2_Decryption.py" id="downloadFileName">
			<input type="hidden" name="objectName" value="2023/a6/bb/5a/a6bb5aac-a158-43d2-b5ca-b3aae2dd23a8" id="downloadObjectName">
			<input type="hidden" name="downloadMode" id="downloadMode" value="">
		</form>
	</div>

		<form action="https://beefplus.center.kobe-u.ac.jp/lms/course/report/submission" method="post" id="reportSubmissionForm" enctype="multipart/form-data"><input type="hidden" name="_cid" value="9434b548-5503-4874-a247-0a681e29a5af"><input type="hidden" name="_csrf" value="b34a2c5e-579f-4103-a6fc-e36c9723c4c7">

			
			<input type="hidden" name="method" value="0">
			<input type="hidden" name="idnumber" value="20243T5072001">
			<input id="reportId" type="hidden" name="reportId" value="16020">
			<input id="maxFileCount" type="hidden" name="maxFileCount" value="1">

			<div>
				
				
		<div class="error-count-message-area">
			
			
				
			
		</div>
	
			</div>

			
			

			<!--既に提出済みの成果物 -->
			

			
				<!-- 成果物提出 -->
				<input type="hidden" id="isDragAndDrop" name="dragAndDrop" value="false">
				
				<div class="block clearfix">
					
					<div class="report-submission-link-area">
						<a id="toDragAndDrop" class="link-txt">ドラッグ＆ドロップでファイルをアップロードする</a>
						<a id="toSelectFile" class="link-txt contents-hidden">ファイル選択でアップロードする</a>
					</div>
					
					<div id="report" class="contents-list">
						
						<div class="contents-detail contents-vertical">
							
							<div class="report-submission-file-title-header-area contents-header-txt report-color">
								<span class="bold-txt">成果物提出</span>
							</div>
							
							<div id="submissionArea" class="result-list submissionArea"><div class="result-list contents-detail report-submission-area submissionContentsArea" style="display: block;">


			
			<button type="button" class="fileSelectButton">参照</button>
			
			<input type="file" class="fileSelectInput" name="uploadFiles" style="display : none;">
			<input type="hidden" class="originalFileName" name="originalFileName" value="">
			<input type="hidden" name="fileId" value="0">
			<input type="hidden" name="rowCounter" value="1">


			
			<span class="fileSelectName">ファイルが選択されていません。</span>

			
			<a class="input-file-btn-area btn btn-inline btn-file-margin btn-txt btn-color clearfile messageDelete">取消</a>
			
			<div class="contents-detail" style="margin-top: 10px;">
				<div>コメント(任意)</div>
				<input type="text" name="fileName" class="input input-box">
			</div>
		</div>
								
							</div>
							<div class="contents-list">
								
								<div class="result-list contents-display-flex">
									<a class="input-file-btn-area btn-inline btn-txt btn-color fileadd disabled" style="pointer-events: none;">ファイル追加</a>
								</div>
								
								<div id="add_contents_msg" class="highlight-txt">アップロードできるファイル数は1個です。</div>
								
								
							</div>
						</div>
					</div>
					
					<div id="report_dad" class="contents-list contents-hidden">
						<div class="contents-detail contents-vertical">
							
							<div class="report-submission-file-title-header-area contents-header-txt report-color">
								<span class="bold-txt">成果物提出</span>
							</div>
							
							<div id="submissionArea" class="contents-list submissionArea">
								<div class="result-list contents-display-flex">
									
									<div class="contents-detail">
										
										<div id="fileDadArea" class="drag-drop-area">このエリアに対象ファイルをドラッグ＆ドロップするとファイルがアップロードされます。</div>
										
										<div id="add_upload_msg" class="highlight-txt"></div>
										
										
									</div>
								</div>
							</div>
							
							<div id="dad_file_area">
								
							</div>
						</div>
					</div>
				</div>

				
				
			

			<!-- フッターボタン表示領域 -->
			<div class="block-under-area">
				
				<div class="under-area-txt">
					<div>上記内容でよろしければ「確認画面に進む」ボタンをクリックして次に進んでください。</div>
				</div>

				

				
				<div class="block-under-area-btn">

					
					<a class="under-btn btn-txt btn-color course_on_report_submission" href="https://beefplus.center.kobe-u.ac.jp/lms/course?idnumber=20243T5072001&amp;_cid=9434b548-5503-4874-a247-0a681e29a5af">保存せずに前の画面に戻る</a>

					
					

					
					
						<a id="report_submission_btn" class="under-btn btn-txt btn-color">確認画面に進む</a>
					
				</div>
			</div>
		</form>

		
		
		<div id="add_block" class="result-list contents-detail report-submission-area submissionContentsArea" style="display : none">


			
			<button type="button" class="fileSelectButton">参照</button>
			
			<input type="file" class="fileSelectInput" name="uploadFiles" style="display : none;">
			<input type="hidden" class="originalFileName" name="originalFileName" value="">
			<input type="hidden" name="fileId" value="0">
			<input type="hidden" name="rowCounter" value="1">


			
			<span class="fileSelectName">ファイルが選択されていません。</span>

			
			<a class="input-file-btn-area btn btn-inline btn-file-margin btn-txt btn-color clearfile messageDelete">取消</a>
			
			<div class="contents-detail" style="margin-top: 10px;">
				<div>コメント(任意)</div>
				<input type="text" name="fileName" class="input input-box">
			</div>
		</div>

		
		<div id="dad_add_block" class="clearfix dadSubmissionBlock" style="display : none;">
			<div class="result-list contents-display-flex">
				<input type="hidden" name="originalFileName" class="dad_originalFileName" value="">
				<input type="hidden" name="fileId" value="0">
				<input type="hidden" name="rowCounter" value="1">

				
				<div class="dad_fileSelectName onebox_row"></div>

				
				<a href="https://beefplus.center.kobe-u.ac.jp/course" class="input-file-btn-area btn btn-inline btn-file-margin btn-txt btn-color dad_clearfile messageDelete">取消</a>
			</div>
			<div class="result-list contents-display-flex">
				
				<div class="contents-detail" style="margin-top: 10px;">
					<div>コメント(任意)</div>
					<input type="text" class="input input-box" name="fileName">
				</div>
			</div>
		</div>
	</div>
</div>

				<!--ダイレクトリンク-->
				<div>
			<div class="page-directlink clearfix">
				<div class="page-directlink-txt">このページのダイレクトリンク</div>
				<input type="text" id="pageDirectlinkUrl" class="input input-box direct-link-box" readonly="readonly" onclick="$(&#39;#pageDirectlinkUrl&#39;).select();return false;" value="https://beefplus.center.kobe-u.ac.jp/lms/course/report/submission?idnumber=20243T5072001&amp;reportId=16020">
				<a href="javascript:void(0)" class="btn-color btn-txt input-small-box" onclick="$(&#39;#pageDirectlinkUrl&#39;).select();document.execCommand(&#39;copy&#39;);return false;">選択</a>
			</div>
		</div>
			</div>

			<!--フッタ-->
			<div id="page_foot" class="page-foot">
		<div class="page-foot-contents clearfix">
			<a target="_blank" class="page-foot-logo" href="https://beefplus.center.kobe-u.ac.jp/lms/timetable">
				<img src="./Lesson2_Decryption_files/footerlogo">
			</a>
			<div class="page-foot-link">
				<ul class="page-foot-link-contents">
					<!-- <li class="page-foot-link-list"><a class="page-foot-link-colomn" target="_blank" th:href="${@environment.getProperty('footer.site.url')}" th:text="#{footer.site.label}"></a></li>
					<li class="page-foot-link-list"><a class="page-foot-link-colomn" target="_blank" th:href="${@environment.getProperty('footer.policy.url')}" th:text="#{footer.policy.label}"></a></li> -->
					<li class="page-foot-link-list"><label>Copyright © ISTC. KOBE UNIV. All Rights Reserved.</label></li>
				</ul>
			</div>
		</div>
		<div class="page-top-btn" style="opacity: 0; display: block;">Top</div>
	</div>

		</div>
		
		<div id="progressMessage" hidden="true">データ処理中です</div>
	</div>

	<!-- お知らせ詳細 -->
	<div>
		<form action="https://beefplus.center.kobe-u.ac.jp/lms/course/information/list" method="post" id="informationDtl"><input type="hidden" name="_cid" value="9434b548-5503-4874-a247-0a681e29a5af"><input type="hidden" name="_csrf" value="b34a2c5e-579f-4103-a6fc-e36c9723c4c7">
			<input type="hidden" id="viewPage" name="viewPage" value="1">
			<input type="hidden" id="viewkind" name="viewkind" value="9">
			<input type="hidden" id="informationId" name="informationId">
		</form>
		<div id="info_detail_view2" hidden="true"></div>
	</div>


</body></html>