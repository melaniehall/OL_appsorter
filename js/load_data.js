
$(document).ready(function () {
var appArray = new Array();
var allTags = new Array();
var allComments = new Array();


//On Load, Retrieve All Apps  
 	$.ajax({
      url: '/backliftapp/apps',
      type: "GET",
      dataType: 'json',
      success: function(data) {
      	appArray = data;
      	
      	createTag_Filter_List();

      	console.log(appArray);
		for (i=0; i < data.length; i++){
			//Dynamically Create Genre List
			$("#selectGenre").append('<option value="'+ data[i].GenreName + '">'+ data[i].GenreName +'</option>');
			removeDuplicateGenres();
			//Checking for Ipad Screenshots
			if(data[i].IpadScreenshotUrl1 !== undefined && data[i].ScreenshotUrl1 === undefined){
			$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"> <h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].IpadScreenshotUrl1 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl2 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl3 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><p class="postscript">These Screenshots are for the iPad</p><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
			}
			else{
			//Load all Apps that Have App Screenshots
			$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].ScreenshotUrl1 + '" width="22%"><img src="' + data[i].ScreenshotUrl2 + '" width="22%"><img src="' + data[i].ScreenshotUrl3 + '" width="22%"><img src="' + data[i].ScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button type="submit" class="btn-postcomment" class="btn-postcomment" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
			};
			removeEmptyImages();
			var appId = data[i].id
			

			// RESETS AND CLEARS OUT ALL COMMENTS
			// addCommentKey(appId);

			// RESETS AND CLEARS OUT ALL TAGS TO 'ALL'
			// addTagKey(appId);


			}; //end for loop
			chooseGenre(data); //on change of Genre Function
			postComment();
			appendTags();
			appendComments();

			// Pagination
			$("div.holder").jPages({
			    containerID : "app-view"
			  });

			//OnClick of Add Tag Button
				$(".btn-add-tag").click(function(){
					var index = $(this).data("id");
					var input = $("input[data-id='" + index + "']")
					var appId = appArray[index].id;
					var tagArray = appArray[index].tags + ", " + input.val(); 
					
					postTag(appId, tagArray);
					input.val(" ")
					});
     				}, 
			      error: function(data){
			        alert("errors on GET");
			      }

	}); //end ajax


// *****************************COMMMENTING FUNCTIONS **********************************
				function postComment (){
					$(".btn-postcomment").click(function(){
					var index = $(this).data("id");
					var comment = $('textarea[data-id="comments-' + index + '"]')
					
					var name = $("input[data-id='name-" + index + "']")
					var appId = appArray[index].id;
					var commentArray = appArray[index].comments + ", " + comment.val(); 
					


					storeComment(appId, commentArray, name, index);
					name.val(" ");
					comment.val(" ");
					appendComments();

					});
     				};

     			function storeComment(appId, commentArray, name, index){
     				$('textarea[data-id="comments' + index + '"]').attr("value=' '")
					$('input[data-id="name-' + index + '"]').attr("value=' '")
					$.ajax({
				      url: '/backliftapp/apps/'+ appId,
				      type: "PUT",
				      dataType: 'json',
				      data: {
				      comments: commentArray
				      },
				      success: function(data) {
				      	listComments();
				      }
					});//end ajax

				}//end storeComment
	
				function listComments(){
					 $.ajax({
					      url: '/backliftapp/apps',
					      type: "GET",
					      dataType: 'json',
					      success: function(data) {
					      	appArray = data;
					      	
					      	appendComments();
						      }//end success
					  });//end ajax

				}; //end listComments

				function appendComments(){

						//To Each App 
					$(".comment-area").html("")
							for (i=0; i < appArray.length; i++){
								var commentString = appArray[i].comments;
								
								var commentArray = commentString.split(", ");
								var commentCount = commentArray.length - 1;

								$(".accordion-heading[data-id='" + i + "'] a").html("&raquo COMMENTS (" + commentCount + ")");
								
								//need to loop through the tagArray...
								jQuery.each(commentArray, function(){
									
									// $(".tag-list-sidebar").append("<li value='"+ this +"'><a class='tag' value='"+ this +"' name='" + this + "' href='#topofpage'>"+ this + "</a></li>");
									$(".comment-area[data-id='" + i + "']").append("<p>" + this + "</p>");
								});//end each
							};//end for

					// 	} //end success
					// }); //end ajax
				};//end appendComments;

				function addCommentKey(appId){
					$.ajax({
				      url: '/backliftapp/apps/'+ appId,
				      type: "PUT",
				      dataType: 'json',
				      data: {
				      	comments: "Notes: "
				      },
				      success: function(data) {
				      	alert ("successful comment ad" + appId);
				      },
				      error: function(data){
				      	alert("fail");
				      }
					});//end ajax
				};//end addTagKey



// ******************************* TAGGING FUNCTIONS *****************************
function createTag_Filter_List(){
$.map(appArray, function (e, i){
      		var appTagArray = e.tags.split(", ");
      		$.map(appTagArray, function (f, j){
      			var tag = f;
      			var patt1= new RegExp(tag);
			// spit string, set new array = variable array, then loop through it. 
			if (patt1.test(allTags) === false){
      			allTags.push(f)
      			}
      		});
      	});
allTags.sort()
};

function appendTags(){
	// To Sidebar
$(".tag-list-sidebar").html("");
createTag_Filter_List();
	//To Each App 
$(".tag-container").html("")
jQuery.each(allTags, function(){
				$(".tag-list-sidebar").append("<li value='"+ this +"'><a class='tag' value='"+ this +"' name='" + this + "' href='#topofpage'>"+ this + "</a></li>");
});
	// $.ajax({
 //      url: '/backliftapp/apps',
 //      type: "GET",
 //      dataType: 'json',
 //      success: function(data) {
 //      	appArray = data;
		for (i=0; i < appArray.length; i++){
			var tagString = appArray[i].tags;
			var tagArray = tagString.split(", ");
			
			//need to loop through the tagArray...
			jQuery.each(tagArray, function(){
				// $(".tag-list-sidebar").append("<li value='"+ this +"'><a class='tag' value='"+ this +"' name='" + this + "' href='#topofpage'>"+ this + "</a></li>");
				$(".tag-container[data-id='" + i + "']").append("<a class='tag' href='#topofpage' name='" + this + "'> " + this + " </a>");
			});//end each
		};//end for


			$(".tag").click(function(){
				var tagName = $(this).attr("name");
				filterByTag(tagName);
				removeEmptyImages()
			})//end Click

// 	} //end success
// }); //end ajax
};//end appendTags;

// Call Only on Initial Load of Apps OR to RESET tags
function addTagKey(appId){
	$.ajax({
      url: '/backliftapp/apps/'+ appId,
      type: "PUT",
      dataType: 'json',
      data: {
      	tags: "all"
      },
      success: function(data) {
      	alert ("successful" + appId);
      },
      error: function(data){
      	alert("fail");
      }
	});//end ajax
};//end addTagKey


function postTag(appId, tagArray){
	$.ajax({
      url: '/backliftapp/apps/'+ appId,
      type: "PUT",
      dataType: 'json',
      data: {
      tags: tagArray
      },
      success: function(data) {
      	listTags();
      }
	});//end ajax

}//end postTag

function listTags(){
	 	$.ajax({
      url: '/backliftapp/apps',
      type: "GET",
      dataType: 'json',
      success: function(data) {
      	appArray = data;
      	appendTags();
      }//end success
  });//end ajax

}; //end listTags

//ON CLICK OF TAG
$(".tag").click(function(){
	var tagName = $(this).attr("name");
	filterByTag(tagName);
	removeEmptyImages()

})//end Click
// **************************PAGINATION*****************************************
// function pagination(){
//     $(".app").pagination({
//         items: 20,
//         itemsOnPage: 10,
//         cssStyle: 'light-theme'
//     });
// };


// **************************REMOVING FUNCTIONS*****************************************

function removeDuplicateGenres(){
$('#selectGenre option').each(function() {
  $(this).prevAll('option[value="' + this.value + '"]').remove();
});
};

function removeDuplicateTags(){
$('.tag-list-sidebar li').each(function() {
  $(this).prevAll('li a[value="' + this.value + '"]').remove();
});
};

function removeEmptyImages(){
	$('.app-toggle').each(function(){
	$(this).find('img[src="undefined"]').remove();
});
};


// **************************FILTERING FUNCTIONS ***************************************
function filterByTag(tagName){
		$("#app-view").html(" ");
		var tag = tagName;

// Set Category Name
		if(tag === "all"){
		$("#category-name").html('<h2> Browse All Apps </h2>')
		}
		
		else {
		$("#category-name").html('<h2>#'+ tag + '</h2>')

		}

	//Loops through all the apps and selects the apps with matching genre
		for (i=0; i < appArray.length; i++){
			var patt1= new RegExp(tag);
			// spit string, set new array = variable array, then loop through it. 
			if (patt1.test(appArray[i].tags) === true){
				if (appArray[i].ScreenshotUrl1 === undefined && appArray[i].IpadScreenshotUrl1 !== undefined){
					$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + appArray[i].Title + '</h3><p> Genre: ' + appArray[i].GenreName + '</p></div><img src="' + appArray[i].IpadScreenshotUrl1 + '" width="22%"><img src="' + appArray[i].IpadScreenshotUrl2 + '" width="22%"><img src="' + appArray[i].IpadScreenshotUrl3 + '" width="22%"><img src="' + appArray[i].IpadScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><p class="postscript">These Screenshots are for the iPad</p><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
					}
					
					else if (appArray[i].ScreenshotUrl1 != ""){
					$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + appArray[i].Title + '</h3><p> Genre: ' + appArray[i].GenreName + '</p></div><img src="' + appArray[i].ScreenshotUrl1 + '" width="22%"><img src="' + appArray[i].ScreenshotUrl2 + '" width="22%"><img src="' + appArray[i].ScreenshotUrl3 + '" width="22%"><img src="' + appArray[i].ScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><p class="postscript">These Screenshots are for the iPad</p><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
					}

			} //end if

		}; //end for
		// removeEmptyImages();
		chooseGenre(appArray);
		postComment();
		appendTags();
		appendComments();
		
		// Pagination
		$("div.holder").jPages({
		    containerID : "app-view"
		 });

		$(".btn-add-tag").click(function(){
					var index = $(this).data("id");
					var input = $("input[data-id='" + index + "']")
					
					var appId = appArray[index].id;
					var tagArray = appArray[index].tags + ", " + input.val(); 

					postTag(appId, tagArray);
					input.val(" ");

				});

};//end filter


function chooseGenre(data){
	var genre = "";

	$("#selectGenre").change(function () {
		$("#app-view").html(" ");
		genre = $("#selectGenre option:selected").val(); 
		
		if(genre === "All"){
		$("#category-name").html('<h2> Browse All Apps </h2>')
		}
		
		else {
		$("#category-name").html('<h2>'+ genre + '</h2>')

		}

	//Loops through all the apps and selects the apps with matching genre
		for (i=0; i < data.length; i++){
		if(genre === "All" && data[i].IpadScreenshotUrl1 !== undefined && data[i].ScreenshotUrl1 === undefined){
			$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].IpadScreenshotUrl1 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl2 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl3 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><p class="postscript">These Screenshots are for the iPad</p><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
			}
		
		else if (genre === "All" && data[i].ScreenshotUrl1 !== undefined){
		$("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].ScreenshotUrl1 + '" width="22%"><img src="' + data[i].ScreenshotUrl2 + '" width="22%"><img src="' + data[i].ScreenshotUrl3 + '" width="22%"><img src="' + data[i].ScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
		}

		else if (data[i].GenreName === genre && data[i].ScreenshotUrl1 === undefined && data[i].IpadScreenshotUrl1 !== undefined){
		  $("#app-view").append('<div class="row-fluid app"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].IpadScreenshotUrl1 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl2 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl3 + '" width="22%"><img src="' + data[i].IpadScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><p class="postscript">These Screenshots are for the iPad</p><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '"> &raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
		}
		
		else if (data[i].GenreName === genre && data[i].ScreenshotUrl1 != ""){
		  $("#app-view").append('<div class="row-fluid"><div class="span12"><div class="app-toggle"><div class="app-header span12"><h3>' + data[i].Title + '</h3><p> Genre: ' + data[i].GenreName + '</p></div><img src="' + data[i].ScreenshotUrl1 + '" width="22%"><img src="' + data[i].ScreenshotUrl2 + '" width="22%"><img src="' + data[i].ScreenshotUrl3 + '" width="22%"><img src="' + data[i].ScreenshotUrl4 + '" width="22%"><br/><input class="tag-input" data-id="'+ i + '"><button class="btn-add-tag" data-id="' + i + '">Add Tag</button><div class="tag-container" data-id="' + i + '"></div><!--Begin Commenting--><div class="accordion" id="accordion-'+ i +'"><div class="accordion-group"><div class="accordion-heading" data-id="' + i + '"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-' + i + '" href="#collapse'+ i + '">&raquo; Comments</a></div><div id="collapse'+ i + '" class="accordion-body collapse"><div class="accordion-inner"><p class="comment-instructions">Let us know your thoughts about the look and feel of this app:</p><textarea class="span12" rows="4" cols="50" data-id="comments-' + i + '"></textarea><button class="btn-postcomment" class="btn-postcomment" type="submit" data-id="' + i + '">Post Comment</button><div class="comment-area" data-id="'+ i +'"></div></div></div></div></div><!--End Commenting--></div><!--/app-toggle--></div></div> <!--/span--></div> <!--/row -->');
		}

		}; //end for
		removeEmptyImages();
		postComment();
		appendTags();
		appendComments();


		// Pagination
		$("div.holder").jPages({
		    containerID : "app-view"
		});

$(".btn-add-tag").click(function(){
					var index = $(this).data("id");
					var input = $("input[data-id='" + index + "']")
					var appId = appArray[index].id;
					var tagArray = appArray[index].tags + ", " + input.val(); 

					postTag(appId, tagArray);
					appendTags();

				});

	}); //end change
};//end choose


});//end ready

