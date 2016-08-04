function SoliloquySlidesUpdate(e){SoliloquySlides.reset();var t="ul#soliloquy-output li.soliloquy-slide"+(e?".selected":"");jQuery(t).each(function(){var e=jQuery.parseJSON(jQuery(this).attr("data-soliloquy-image-model"));SoliloquySlides.add(new SoliloquySlide(e))})}jQuery(document).ready(function($){$("a.soliloquy-slides-delete").click(function(e){e.preventDefault();var t=confirm(soliloquy_metabox.remove_multiple);if(!t)return!1;var i=[];$("ul#soliloquy-output > li.selected").each(function(){i.push($(this).attr("id"))});var l={action:"soliloquy_remove_slides",attachment_ids:i,post_id:soliloquy_metabox.id,nonce:soliloquy_metabox.remove_nonce};$.post(soliloquy_metabox.ajax,l,function(e){$("ul#soliloquy-output > li.selected").remove(),$(".soliloquy-bulk-actions").fadeOut(),$(".soliloquy-select-all").prop("checked",!1),$(".soliloquy-load-library").attr("data-soliloquy-offset",0).addClass("has-search").trigger("click"),SoliloquySlidesUpdate(!1);var t=$("#soliloquy-output li").length;$(".soliloquy-count").text(t.toString()),0===t&&($(".soliloquy-bulk-actions").fadeOut(),$(".soliloquy-slide-header").fadeOut().addClass("soliloquy-hidden"),$("#soliloquy-empty-slider").removeClass("soliloquy-hidden").fadeIn())},"json")}),$("#soliloquy-settings-content ").on("click",".soliloquy-remove-slide",function(e){e.preventDefault();var t=confirm(soliloquy_metabox.remove);if(t){var i=$(this).parent().attr("id"),l={action:"soliloquy_remove_slide",attachment_id:i,post_id:soliloquy_metabox.id,nonce:soliloquy_metabox.remove_nonce};$.post(soliloquy_metabox.ajax,l,function(e){$("#"+i).fadeOut("normal",function(){$(this).remove(),$(".soliloquy-load-library").attr("data-soliloquy-offset",0).addClass("has-search").trigger("click"),SoliloquySlidesUpdate(!1);var e=$("#soliloquy-output li").length;$(".soliloquy-count").text(e.toString()),0===e&&($(".soliloquy-bulk-actions").fadeOut(),$(".soliloquy-slide-header").fadeOut().addClass("soliloquy-hidden"),$("#soliloquy-empty-slider").removeClass("soliloquy-hidden").fadeIn())})},"json")}})});var SoliloquySlide=Backbone.Model.extend({defaults:{id:"",title:"",caption:"",alt:"",link:"",type:""}}),SoliloquySlides=new Backbone.Collection,SoliloquyModalWindow=new wp.media.view.Modal({controller:{trigger:function(){}}}),SoliloquyView=wp.Backbone.View.extend({id:"soliloquy-meta-edit",tagName:"div",className:"edit-attachment-frame mode-select hide-menu hide-router",template:wp.template("soliloquy-meta-editor"),events:{"click .edit-media-header .left":"loadPreviousItem","click .edit-media-header .right":"loadNextItem","keyup input":"updateItem","keyup textarea":"updateItem","change input":"updateItem","change textarea":"updateItem","keyup .CodeMirror":"updateCode","blur textarea":"updateItem","change select":"updateItem","click a.soliloquy-meta-submit":"saveItem","keyup input#link-search":"searchLinks","click div.query-results li":"insertLink","click a.soliloquy-thumbnail":"insertThumb","click a.soliloquy-thumbnail-delete":"removeThumb","click button.media-file":"insertMediaFileLink","click button.attachment-page":"insertAttachmentPageLink"},initialize:function(e){this.is_loading=!1,this.collection=e.collection,this.child_views=e.child_views,this.attachment_id=e.attachment_id,this.attachment_index=0,this.search_timer="";var t=0;this.collection.each(function(i){return parseInt(i.get("id"))===parseInt(e.attachment_id)?(this.model=i,this.attachment_index=t,!1):void t++},this)},updateCode:function(e){$model=this.model,$textarea=this.$el.find(".soliloquy-html-slide-code"),$model.set("code",this.editor.getValue(),{silent:!0}),$textarea.text()},insertThumb:function(e){$model=this.model,e.preventDefault();var t=this.$el.data("field"),i=wp.media.frames.soliloquy_media_frame=wp.media({className:"media-frame soliloquy-media-frame",frame:"select",multiple:!1,title:soliloquy_metabox.videoframe,library:{type:"image"},button:{text:soliloquy_metabox.videouse}});i.on("select",function(){var e=i.state().get("selection").first().toJSON();$model.set("src",e.url,{silent:!0}),jQuery("div.thumbnail > img",$parent.find(".media-frame-content")).attr("src",e.url)}),i.open()},removeThumb:function(e){e.preventDefault(),$model=this.model,$parent=this.$el.parent(),jQuery("div.thumbnail > img",$parent.find(".media-frame-content")).attr("src",""),$model.set("src","",{silent:!0})},render:function(){return this.$el.html(this.template(this.model.attributes)),this.child_views.length>0&&this.child_views.forEach(function(e){var t=new e({model:this.model});this.$el.find("div.addons").append(t.render().el)},this),this.$el.find("textarea[name=caption]").val(this.model.get("caption")),setTimeout(function(){quicktags({id:"caption",buttons:"strong,em,link,ul,ol,li,close"}),QTags._buttonsInit()},500),wpLink.init,0===this.attachment_index&&this.$el.find("button.left").addClass("disabled"),this.attachment_index==this.collection.length-1&&this.$el.find("button.right").addClass("disabled"),textarea=this.$el.find(".soliloquy-html-slide-code"),textarea.length&&(this.editor=CodeMirror.fromTextArea(textarea[0],{enterMode:"keep",indentUnit:4,electricChars:!1,lineNumbers:!0,lineWrapping:!0,matchBrackets:!0,mode:"php",smartIndent:!1,tabMode:"shift",theme:"ttcn"})),this.$el.trigger("soliloquyRenderMeta"),this},loading:function(){this.is_loading=!0,this.$el.find(".spinner").css("visibility","visible")},loaded:function(e){this.is_loading=!1,this.$el.find(".spinner").css("visibility","hidden"),"undefined"!=typeof e&&alert(e)},loadPreviousItem:function(){this.attachment_index--,this.model=this.collection.at(this.attachment_index),this.attachment_id=this.model.get("id"),this.render()},loadNextItem:function(){this.attachment_index++,this.model=this.collection.at(this.attachment_index),this.attachment_id=this.model.get("id"),this.render()},updateItem:function(e){""!=e.target.name&&("checkbox"==e.target.type?value=e.target.checked?1:0:value=e.target.value,this.model.set(e.target.name,value))},saveItem:function(e){e.preventDefault(),this.trigger("loading"),wp.media.ajax("soliloquy_save_meta",{context:this,data:{nonce:soliloquy_metabox.save_nonce,post_id:soliloquy_metabox.id,attach_id:this.model.get("id"),meta:this.model.attributes},success:function(e){this.trigger("loaded loaded:success");var t=JSON.stringify(this.model.attributes);jQuery("ul#soliloquy-output li#"+this.model.get("id")).attr("data-soliloquy-image-model",t);var i=this.$el.find(".saved");i.fadeIn(),setTimeout(function(){i.fadeOut()},1500)},error:function(e){this.trigger("loaded loaded:error",e)}})},searchLinks:function(e){},insertLink:function(e){},insertMediaFileLink:function(e){this.trigger("loading"),wp.media.ajax("soliloquy_get_attachment_links",{context:this,data:{nonce:soliloquy_metabox.save_nonce,attachment_id:this.model.get("id")},success:function(e){this.model.set("link",e.media_link),this.trigger("loaded loaded:success"),this.render()},error:function(e){this.trigger("loaded loaded:error",e)}})},insertAttachmentPageLink:function(e){this.trigger("loading"),wp.media.ajax("soliloquy_get_attachment_links",{context:this,data:{nonce:soliloquy_metabox.save_nonce,attachment_id:this.model.get("id")},success:function(e){this.model.set("link",e.attachment_page),this.trigger("loaded loaded:success"),this.render()},error:function(e){this.trigger("loaded loaded:error",e)}})}}),SoliloquyChildViews=[],SoliloquyContentViews=[];!function($){$(document).ready(function(){soliloquy_edit={init:function(){SoliloquySlidesUpdate(),$("#soliloquy-settings-content").on("click.soliloquyModify",".soliloquy-modify-slide",function(e){e.preventDefault();var t=$(this).parent().data("soliloquy-slide");SoliloquyModalWindow.content(new SoliloquyView({collection:SoliloquySlides,child_views:SoliloquyChildViews,attachment_id:t})),SoliloquyModalWindow.open(),$(".CodeMirror").each(function(e,t){t.CodeMirror.refresh()})})}},soliloquy_edit.init()}),$(document).on("soliloquyUploaded",function(){soliloquy_edit.init()})}(jQuery);var SoliloquyBulkEditImageView=wp.Backbone.View.extend({tagName:"li",className:"attachment",template:wp.template("soliloquy-meta-bulk-editor-slides"),initialize:function(e){this.model=e.model},render:function(){return this.$el.html(this.template(this.model.attributes)),this}}),SoliloquyBulkEditView=wp.Backbone.View.extend({id:"soliloquy-meta-edit-bulk",tagName:"div",className:"edit-attachment-frame mode-select hide-menu hide-router",template:wp.template("soliloquy-meta-bulk-editor"),events:{"keyup input":"updateItem","keyup textarea":"updateItem","change input":"updateItem","change textarea":"updateItem","blur textarea":"updateItem","change select":"updateItem","click .actions a.soliloquy-meta-submit":"saveItem","keyup input#link-search":"searchLinks","click div.query-results li":"insertLink","click button.media-file":"insertMediaFileLink","click button.attachment-page":"insertAttachmentPageLink"},initialize:function(e){this.on("loading",this.loading,this),this.on("loaded",this.loaded,this),this.is_loading=!1,this.collection=e.collection,this.child_views=e.child_views,this.model=new SoliloquySlide},render:function(){return this.$el.html(this.template(this.model.toJSON())),this.collection.forEach(function(e){var t=new SoliloquyBulkEditImageView({model:e});this.$el.find("ul.attachments").append(t.render().el)},this),this.child_views.length>0&&this.child_views.forEach(function(e){var t=new e({model:this.model});this.$el.find("div.addons").append(t.render().el)},this),this.$el.find("textarea[name=caption]").val(this.model.get("caption")),setTimeout(function(){quicktags({id:"caption",buttons:"strong,em,link,ul,ol,li,close"}),QTags._buttonsInit()},100),wpLink.init,this},renderError:function(e){var t={};t.error=e;var i=new wp.media.view.SoliloquyError({model:t});return i.render().el},loading:function(){this.is_loading=!0,this.$el.find(".spinner").css("visibility","visible")},loaded:function(e){this.is_loading=!1,this.$el.find(".spinner").css("visibility","hidden"),"undefined"!=typeof e&&this.$el.find("ul.attachments").before(this.renderError(e))},updateItem:function(e){""!=e.target.name&&("checkbox"==e.target.type?value=e.target.checked?1:0:value=e.target.value,this.model.set(e.target.name,value))},saveItem:function(){this.trigger("loading");var e=[];this.collection.forEach(function(t){e.push(t.id)},this),wp.media.ajax("soliloquy_bulk_save_meta",{context:this,data:{nonce:soliloquy_metabox.save_nonce,post_id:soliloquy_metabox.id,meta:this.model.attributes,image_ids:e},success:function(e){this.collection.forEach(function(e){for(var t in this.model.attributes)value=this.model.attributes[t],value.length>0&&e.set(t,value);var i=JSON.stringify(e.attributes);jQuery("ul#soliloquy li#"+e.get("id")).attr("data-solioquy-image-model",i),jQuery("ul#soliloquy li#"+e.get("id")+" div.title").text(e.get("title"))},this),this.trigger("loaded loaded:success"),SoliloquyModalWindow.close()},error:function(e){this.trigger("loaded loaded:error",e)}})},insertMediaFileLink:function(e){this.trigger("loading"),this.model.set("link",response.media_link),this.trigger("loaded loaded:success"),this.render()},insertAttachmentPageLink:function(e){this.trigger("loading"),this.model.set("link",response.media_link),this.trigger("loaded loaded:success"),this.render()}});jQuery(document).ready(function($){$("#soliloquy-settings-content").on("click","a.soliloquy-slides-edit",function(e){e.preventDefault(),SoliloquySlidesUpdate(!0),SoliloquyModalWindow.content(new SoliloquyBulkEditView({collection:SoliloquySlides,child_views:SoliloquyChildViews})),SoliloquyModalWindow.open()})}),function($,e,t,i){"use strict";var l={init:function(){this.select_all(),this.sortable(),this.select(),this.display(),this.chosen(),this.slide_size(),this.uploadImage(),this.toggleStatus(),this.tooltip(),this.clear_selected(),new Clipboard(".soliloquy-clipboard"),$("ul#soliloquy-output").on("click","a.check",function(e){e.preventDefault()}),$(".soliloquy-clipboard").on("click",function(e){e.preventDefault()});var e=$("#soliloquy-output li").length;$(".soliloquy-count").text(e.toString()),$("input,select").conditional()},toggleStatus:function(){$("#soliloquy-settings-content").on("click.soliloquyStatus",".soliloquy-slide-status",function(e){if(e.preventDefault(),$(this).hasClass("list-status"))var t=$(this).parent().parent().parent();else var t=$(this).parent();var l=$(this),o=l.data("status"),a=t.find(".soliloquy-slide-status.list-status"),s=t.find(".soliloquy-slide-status.grid-status"),n=l.parent().parent().data("view"),d=l.data("id"),u=s.find("span.dashicons"),r=a.find("span"),c=l.data("soliloquy-tooltip");if("active"===o)var h="pending";else var h="active";var m={url:i.ajax,type:"post",async:!0,cache:!1,dataType:"json",data:{action:"soliloquy_change_slide_status",post_id:i.id,slide_id:d,status:h,nonce:i.save_nonce},success:function(e){"active"===h?(s.removeClass("soliloquy-draft-slide").addClass("soliloquy-active-slide"),a.removeClass("soliloquy-draft-slide").addClass("soliloquy-active-slide"),u.removeClass("dashicons-hidden").addClass("dashicons-visibility"),r.text(i.active),s.attr("data-soliloquy-tooltip",i.active),a.data("status","active"),s.data("status","active")):(s.removeClass("soliloquy-active-slide").addClass("soliloquy-draft-slide"),a.removeClass("soliloquy-active-slide").addClass("soliloquy-draft-slide"),u.removeClass("dashicons-visibility").addClass("dashicons-hidden"),r.text(i.draft),a.data("status","pending"),s.data("status","pending"),s.attr("data-soliloquy-tooltip",i.draft))},error:function(e,t,i){}};$.ajax(m)})},tooltip:function(){$("[data-soliloquy-tooltip]").on("mouseover",function(e){e.preventDefault();var t=$(this),i=t.data("soliloquy-tooltip")})},select_all:function(){$(".soliloquy-select-all").change(function(){var e=this.checked;if(e){$("ul#soliloquy-output li").addClass("selected"),$(".soliloquy-bulk-actions").fadeIn();var t=$("ul#soliloquy-output li.selected").length;$(".select-all").text(i.selected),$(".soliloquy-count").text(t.toString()),$(".soliloquy-clear-selected").fadeIn()}else{$("ul#soliloquy-output li").removeClass("selected"),$(".soliloquy-bulk-actions").fadeOut();var l=$("ul#soliloquy-output li").length;$(".select-all").text(i.select_all),$(".soliloquy-count").text(l.toString()),$(".soliloquy-clear-selected").fadeOut()}})},sortable:function(){var e=$("#soliloquy-output");e.sortable({containment:"#soliloquy-slider-main",items:"li",cursor:"move",forcePlaceholderSize:!0,placeholder:"dropzone",update:function(t,l){var o={url:i.ajax,type:"post",async:!0,cache:!1,dataType:"json",data:{action:"soliloquy_sort_images",order:e.sortable("toArray").toString(),post_id:i.id,nonce:i.sort},success:function(e){SoliloquySlidesUpdate()},error:function(e,t,i){}};$.ajax(o)}})},select:function(){var e=!1,l=!1;$("li.soliloquy-slide .soliloquy-item-content, .soliloquy-list li a.check").on("click",function(t){var o=$(this),a=$(this).parent();if(t.preventDefault(),$(a).hasClass("selected")){$(a).removeClass("selected"),l=!1;var s=$("ul#soliloquy-output li.selected").length;if(0!==s)$(".select-all").text(i.selected),$(".soliloquy-count").text(s.toString()),$(".soliloquy-clear-selected").fadeIn();else{var n=$("ul#soliloquy-output li").length;$(".select-all").text(i.select_all),$(".soliloquy-count").text(n.toString()),$(".soliloquy-clear-selected").fadeOut()}}else{if(e&&l!==!1){var d=$("ul#soliloquy-output li").index($(l)),u=$("ul#soliloquy-output li").index($(a)),r=0;if(u>d)for(r=d;u>=r;r++)$("ul#soliloquy-output li:eq( "+r+")").addClass("selected");else for(r=u;d>=r;r++)$("ul#soliloquy-output li:eq( "+r+")").addClass("selected")}$(a).addClass("selected"),l=$(a),s=$("ul#soliloquy-output li.selected").length,$(".soliloquy-clear-selected").fadeIn(),$(".select-all").text(i.selected),$(".soliloquy-count").text(s.toString())}$("ul#soliloquy-output > li.selected").length>0?$(".soliloquy-bulk-actions").fadeIn():$(".soliloquy-bulk-actions").fadeOut()}),$(t).on("keyup keydown",function(t){e=t.shiftKey})},slide_size:function(){$(t).on("change","#soliloquy-config-slider-size",function(){var e=$(this),t=e.val(),l=e.find(":selected").data("soliloquy-width"),o=e.find(":selected").data("soliloquy-height");"default"==t&&($("#soliloquy-config-slider-width").val(i.slide_width),$("#soliloquy-config-slider-height").val(i.slide_height)),l&&$("#soliloquy-config-slider-width").val(l),o&&$("#soliloquy-config-slider-height").val(o)})},clear_selected:function(){$(".soliloquy-clear-selected").on("click",function(e){e.preventDefault();var t=$("#soliloquy-output li").length;$("ul#soliloquy-output li").removeClass("selected"),$(".select-all").text(i.select_all),$(".soliloquy-count").text(t.toString()),$(".soliloquy-select-all").prop("checked",!1),$(".soliloquy-bulk-actions").fadeOut(),$(this).fadeOut()})},display:function(){$("a.soliloquy-display").on("click",function(e){if(e.preventDefault(),!$(this).hasClass("active-display")){var t=$(this),l=t.data("soliloquy-display"),o=$("#soliloquy-output"),a={url:i.ajax,type:"post",async:!0,cache:!1,dataType:"json",data:{action:"soliloquy_slider_view",post_id:i.id,view:l,nonce:i.save_nonce},success:function(e){}};$.ajax(a),$(".soliloquy-display-toggle").find(".active-display").removeClass("active-display"),t.addClass("active-display"),"grid"===l?o.removeClass("soliloquy-list").addClass("soliloquy-grid"):"list"===l&&o.removeClass("soliloquy-grid").addClass("soliloquy-list")}})},chosen:function(){$(".soliloquy-chosen").each(function(){var e=$(this).data("soliloquy-chosen-options");$(this).chosen(e)})},uploadImage:function(){$(".soliloquy-insert-image").on("click",function(e){var t;e.preventDefault();var l=$(event.currentTarget),o=l.parent().find("input");return t?void t.open():(t=wp.media.frames.soliloquy_image_frame=wp.media({frame:"select",library:{type:"image"},title:i.insert_image,button:{text:i.insert_image},contentUserSetting:!1,multiple:!1}),t.on("select",function(){var e=t.state().get("selection").first().toJSON();o.val(e.url)}),void t.open())})}};$(function(){l.init()}),$(t).on("soliloquyType",function(){l.init()})}(jQuery,window,document,soliloquy_metabox),jQuery(document).ready(function($){$("a.soliloquy-media-library").on("click",function(e){return e.preventDefault(),wp.media.frames.soliloquy?void wp.media.frames.soliloquy.open():(wp.media.frames.soliloquy=new wp.media.view.MediaFrame.Post({title:wp.media.view.l10n.insertIntoPost,button:{text:wp.media.view.l10n.insertIntoPost},multiple:!0,library:{type:"image"}}),wp.media.frames.soliloquy.on("open",function(){var e=wp.media.frames.soliloquy.state().get("selection");$("ul#soliloquy-output li").each(function(){var t=wp.media.attachment($(this).attr("id"));e.add(t?[t]:[])})}),wp.media.frames.soliloquy.on("ready",function(e){}),wp.media.frames.soliloquy.on("insert",function(e){var t=wp.media.frames.soliloquy.state(),i=[];e.each(function(e){var l=t.display(e).toJSON(),o=e.get("type");switch(l.link){case"none":e.set("link","");break;case"file":e.set("link",e.get("url"));break;case"post":break;case"custom":e.set("link",l.linkUrl)}"image"===o&&i.push(e.toJSON())},this),$.post(soliloquy_metabox.ajax,{action:"soliloquy_insert_slides",nonce:soliloquy_metabox.insert_nonce,post_id:soliloquy_metabox.id,images:i},function(e){if(e){$("#soliloquy-output").html(e.data),SoliloquySlidesUpdate();var t=$("#soliloquy-output li").length;$(".soliloquy-count").text(t.toString()),t>0&&($("#soliloquy-empty-slider").fadeOut().addClass("soliloquy-hidden"),$(".soliloquy-slide-header").removeClass("soliloquy-hidden").fadeIn(),$(".soliloquy-bulk-actions").fadeOut())}},"json")}),wp.media.frames.soliloquy.open(),$("div.media-menu a.media-menu-item:nth-child(2)").addClass("hidden"),$("div.media-menu a.media-menu-item:nth-child(4)").addClass("hidden"),void $("div.media-menu a.media-menu-item:nth-child(6)").addClass("hidden"))})}),function($,e,t){"use strict";var i=e.location.hash,l=e.location.hash.replace("!","");if(i&&i.indexOf("soliloquy-tab")>=0){var o=$(l.replace("tab_","")),a=o.parent(),s=o.parent().parent().find("ul.soliloquy-tabs-nav"),n=$("#post").attr("action");a.find(".soliloquy-tab-active").removeClass("soliloquy-tab-active"),o.addClass("soliloquy-tab-active"),s.find(".soliloquy-tab-nav-active").removeClass("soliloquy-tab-nav-active"),s.find('a[href="'+l.replace("tab_","")+'"]').parent().addClass("soliloquy-tab-nav-active"),n&&(n=n.split("#")[0],$("#post").attr("action",n+e.location.hash)),$("body").trigger("SoliloquyTabChange")}$(function(){$("[data-soliloquy-tab]").on("click",function(t){t.preventDefault();var i=$(this),l=i.attr("data-tab-id"),o=i.parent(),a=o.parent(),s=o.attr("data-update-hashbang"),n="undefined"!=typeof i.attr("href")?"tab_"+i.attr("href"):"tab_"+l;if(!i.hasClass("soliloquy-tab-nav-active")){if(a.find(".soliloquy-tab-active").removeClass("soliloquy-tab-active"),o.find(".soliloquy-tab-nav-active").removeClass("soliloquy-tab-nav-active"),i.addClass("soliloquy-tab-nav-active"),$("#"+l).addClass("soliloquy-tab-active"),i.trigger("SoliloquyTabChange"),"soliloquy-native"===l&&$("#soliloquy-type-default").prop("checked")!==!0&&($("#soliloquy-types-nav li").removeClass("soliloquy-active"),$("#soliloquy-type-default").prop("checked",!0).trigger("change")),"1"===s){e.location.hash=n.split("#").join("#!");var d=$("#post").attr("action");d&&(d=d.split("#")[0],$("#post").attr("action",d+e.location.hash))}return!1}})})}(jQuery,window,document);