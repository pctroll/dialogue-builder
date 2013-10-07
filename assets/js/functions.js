		var dialogues = [];
		var dialoguesCounter = 0;
		var isEditing = false;
		var imgRoot = "assets/img/";
		var imgPrefix = "btn_";
		var imgSuffix = "";
		var imgExt = ".jpg";
		var characterSelection = [
			["none", "None"],
			/*["maleiwa", "Maleiwa"],
			["wanulu", "Wanulu"],
			["yanomami", "Yanomami"],
			["piaroa", "Piaroa"],
			["guahibo", "Guahibo"],
			["chiguire", "Chiguire"],
			["yekuana", "Yekuana"],
			["heseiyu", "Seiyu (male)"],
			["sheseiyu", "Seiyu (female)"]*/
			["kaito", "Kaito"],
			["len", "Len"],
			["luka", "Luka"],
			["meiko", "Meiko"],
			["miku", "Miku"],
			["rin", "Rin"]
		];
		$(document).ready(function () {

			/**
			 * Sets the New Dialogue Box to 
			 * its initial state.
			 * @return 	void
			 */
			function resetDialogue () {
				$('#dialoguecharacter').val('none');
				$('#dialogueline1').val('');
				$('#dialogueline2').val('');
				$('#dialogueline3').val('');
				$('#dialogueline4').val('');
				$('#dialoguecharacterimg').attr("src", "");
				$('#dialoguecharacter').focus();
			}
			/**
			 * Sets a given selection box's values to
			 * the ones given in the array.
			 * @param 	id 			string specifiying the select-tag id
			 * @param 	inputArray 	bidimensional array (value, text)
			 * @return 	void
			 */
			function setSelection (id, inputArray) {
				if (inputArray === undefined)
					inputArray = characterSelection;
				var i, strOption;
				$('#'+id).empty();
				for (i = 0; i < inputArray.length; i++) {
					strOption = '<option value="'+inputArray[i][0]+'">'+inputArray[i][1]+'</option>';
					$('#'+id).append(strOption);
				}
			}
			/**
			 * Adds the new dialogue box to the dialogues array and
			 * also adds it to the visualizer.
			 * @return 	void
			 */
			function addDialogue () {
				var nDialogue = {
					id: dialoguesCounter++,
					character: $('#dialoguecharacter').val(),
					line1: $('#dialogueline1').val(),
					line2: $('#dialogueline2').val(),
					line3: $('#dialogueline3').val(),
					line4: $('#dialogueline4').val()
				};
				dialogues.push(nDialogue);
				$.ajax({
					url: 'dialoguetemplate.html',
					type: 'GET',
					dataType: 'html',
					success: function (data) {
						$('#dialoguespreview').append(data);
						setDialogue(nDialogue);
						$('#dialogue_'+nDialogue.id).hide();
						$('#dialogue_'+nDialogue.id).fadeIn(300);
						adjustSideBar();
					}
				});
			}
			/**
			 * Removes a dialogue box from the dialogues list
			 * @param 	id 	int
			 * @return 	void
			 */
			function removeDialogue (id) {
				var position = getDialoguePosition(id);
				dialogues.splice(position,1);
				$('#dialogue_'+id).fadeOut(300);
				setTimeout(function () {
					$('#dialogue_'+id).remove();
					adjustSideBar();
				},300);
			}
			/**
			 * Scroll the document depending on the dialogue
			 * @return 	void
			 */
			function adjustSideBar () {
				var scrollTime = 300;
				if (dialogues.length < 2)
					$(document).scrollTo(0, scrollTime);
				else {
					var ref = "#dialogue_"+dialogues[dialogues.length-1].id;
					$(document).scrollTo(ref, scrollTime);
				}
					
			}
			/**
			 * Export the dialogues to a json file.
			 * @return 	void
			 */
			function downloadDialogue () {
				
				if (dialogues.length > 0) {
					var content = JSON.stringify(dialogues);
					var blob = new Blob(
						[content],{type:"text/plain;charset=utf-8"}
					);
					saveAs(blob, "dialogue_name.json");
				}
			}
			/**
			 * Sets the latest dialogue box using the given data.
			 * @param 	data 	JSON containing dialogue's details
			 * @param 	id 		string
			 * @return 	void
			 */
			function setDialogue (data, id) {
				if (id === undefined)
					id = "";
				// Reset the fields that come from the template
				$('#dialogue_'+id).attr("id", "dialogue_"+data.id);
				$('#dialogueimage_'+id).attr("id", "dialogueimage_"+data.id);
				$('#dialoguecharacter_'+id).attr("id", "dialoguecharacter_"+data.id);
				$('#dialogueline1_'+id).attr("id", "dialogueline1_"+data.id);
				$('#dialogueline2_'+id).attr("id", "dialogueline2_"+data.id);
				$('#dialogueline3_'+id).attr("id", "dialogueline3_"+data.id);
				$('#dialogueline4_'+id).attr("id", "dialogueline4_"+data.id);
				$('#dialogueup_'+id).attr("id", "dialogueup_"+data.id);
				$('#dialoguedown_'+id).attr("id", "dialoguedown_"+data.id);
				$('#dialogueedit_'+id).attr("id", "dialogueedit_"+data.id);
				$('#dialoguedelete_'+id).attr("id", "dialoguedelete_"+data.id);
				$('#groupedit_'+id).attr("id", "groupedit_"+data.id);

				if (data.character != "none") {
					var imgUrl = imgRoot+imgPrefix+data.character+imgSuffix+imgExt;
					$('#dialogueimage_'+data.id).attr('src', imgUrl);
					$('#dialoguecharacter_'+data.id).text(data.character.toUpperCase()+":");
				}
				$('#dialogueline1_'+data.id).text(data.line1);
				$('#dialogueline2_'+data.id).text(data.line2);
				$('#dialogueline3_'+data.id).text(data.line3);
				$('#dialogueline4_'+data.id).text(data.line4);
				$('#dialogueup_'+data.id).unbind();
			 	$('#dialoguedown_'+data.id).unbind();
			 	$('#dialogueedit_'+data.id).unbind();
			 	$('#dialoguedelete_'+data.id).unbind();

				$('#dialogueup_'+data.id).bind('click', function (e) {
					var dialogueId = $('#dialogueup_'+data.id).attr("id").replace("dialogueup_", "");
					moveDialogue(dialogueId, "up");
				});
				$('#dialoguedown_'+data.id).bind('click', function (e) {
					var dialogueId = $('#dialoguedown_'+data.id).attr("id").replace("dialoguedown_", "");
					moveDialogue(dialogueId, "down");
				});
				$('#dialogueedit_'+data.id).bind('click', function (e) {
					startEdition(data.id);
				});
				$('#dialoguedelete_'+data.id).bind('click', function (e) {
					removeDialogue(data.id);
				});
			}
			/**
			 *
			 */
			 function setDialogueTemp (id) {
			 	data = {id:"temp"};
				$('#dialogue_'+id).attr("id", "dialogue_"+data.id);
				$('#dialogueimage_'+id).attr("id", "dialogueimage_"+data.id);
				$('#dialoguecharacter_'+id).attr("id", "dialoguecharacter_"+data.id);
				$('#dialogueline1_'+id).attr("id", "dialogueline1_"+data.id);
				$('#dialogueline2_'+id).attr("id", "dialogueline2_"+data.id);
				$('#dialogueline3_'+id).attr("id", "dialogueline3_"+data.id);
				$('#dialogueline4_'+id).attr("id", "dialogueline4_"+data.id);
				$('#dialogueup_'+id).attr("id", "dialogueup_"+data.id);
				$('#dialoguedown_'+id).attr("id", "dialoguedown_"+data.id);
				$('#dialogueedit_'+id).attr("id", "dialogueedit_"+data.id);
				$('#dialoguedelete_'+id).attr("id", "dialoguedelete_"+data.id);
				$('#groupedit_'+id).attr("id", "groupedit_"+data.id);
			 }
			/**
			 * Gets the dialogue position in the JSON array, given its ID.
			 * If not found, returns -1;
			 * @param 	id 	string
			 * @return 	int
			 */
			function getDialoguePosition (id) {
				var i;
				for (i = 0; i < dialogues.length; i++) {
					if (dialogues[i].id == id)
						return i;
				}
				return -1;
			}
			/**
			 * Changes a dialogue's position in the dialogues' array
			 * given its position and the direction (up or down).
			 * @param 	position 	int position in the array
			 * @param 	direction 	string (up or down)
			 * @return 	void
			 */
			function moveDialogue (id, direction) {
				if (isEditing == true)
					return true;
				var position = getDialoguePosition(id);
				var swapPos = position;
				if (direction == "up" && position > 0)
					swapPos--;
				else if (direction == "down" && position < dialogues.length-1)
					swapPos++;
				var prevId = id;
				var nextId = dialogues[swapPos].id;
				tempJson = {
					id: dialogues[swapPos].id,
					character: dialogues[swapPos].character,
					line1: dialogues[swapPos].line1,
					line2: dialogues[swapPos].line2,
					line3: dialogues[swapPos].line3,
					line4: dialogues[swapPos].line4
				};
				dialogues[swapPos] = dialogues[position];
				dialogues[position] = tempJson;
				setDialogueTemp(id);
				setDialogue(dialogues[swapPos], tempJson.id);
				setDialogue(tempJson, "temp");
			}
			/**
			 * Deletes all the dialogues built so far.
			 * @return 	void
			 */
			function dropDialogues () {
				$('#dialoguespreview').empty();
				dialogues = [];
				dialoguesCounter = 0;
				resetDialogue();
			}
			
			/**
			 * Place the input fields in the dialogue box for
			 * editing it.
			 * @param 	id 	int, the dialogue's id
			 * @return 	void
			 */
			function startEdition (id) {
				if (isEditing == true)
					return true;
				isEditing = true;
				var position = getDialoguePosition(id);
				
				$('#dialoguecharacter_'+id).text('');
				$('#dialogueline1_'+id).text('');
				$('#dialogueline2_'+id).text('');
				$('#dialogueline3_'+id).text('');
				$('#dialogueline4_'+id).text('');

				$('#dialoguecharacter_'+id).append('<select class="form-control" name="dialoguecharacteredit" id="dialoguecharacteredit">');
				$('#dialoguecharacter_'+id).append('</select>');
				setSelection("dialoguecharacteredit", characterSelection);
				$('#dialoguecharacteredit').val(dialogues[position].character);
				$('#dialogueline1_'+id).append('<input type="text" class="form-control" name="dialogueline1edit" id="dialogueline1edit" maxlength="35" placeholder="Line 1">');
				$('#dialogueline2_'+id).append('<input type="text" class="form-control" name="dialogueline2edit" id="dialogueline2edit" maxlength="35" placeholder="Line 2">');
				$('#dialogueline3_'+id).append('<input type="text" class="form-control" name="dialogueline3edit" id="dialogueline3edit" maxlength="35" placeholder="Line 3">');
				$('#dialogueline4_'+id).append('<input type="text" class="form-control" name="dialogueline4edit" id="dialogueline4edit" maxlength="35" placeholder="Line 4">');
				$('#dialogueline1edit').val(dialogues[position].line1);
				$('#dialogueline2edit').val(dialogues[position].line2);
				$('#dialogueline3edit').val(dialogues[position].line3);
				$('#dialogueline4edit').val(dialogues[position].line4);

				$('#dialogueedit_'+id).removeClass('btn-primary');
				$('#dialogueedit_'+id).addClass('btn-success');
				$('#dialogueedit_'+id).text('save');
				$('#groupedit_'+id).append('<button class="btn btn-default" id="dialoguecancel_'+id+'">cancel</button>');
				$('#dialoguecharacteredit').change(function (e) {
					var imgUrl = ""
					if (this.value != "none")
						imgUrl = imgRoot+imgPrefix+this.value+imgSuffix+imgExt;
					$('#dialogueimage_'+id).attr("src", imgUrl);
				});
				$('#dialoguecancel_'+id).bind('click', function (e) {
					cancelEdition(id);
				});
				$('#dialogueedit_'+id).unbind();
				$('#dialogueedit_'+id).bind('click', function (e) {
					saveEdition(id);
				});
			}
			/**
			 * Sets the dialogue with the new values in the input fields.
			 * @param 	id 	ind, the dialogue's id.
			 */
			function saveEdition (id) {
				isEditing = false;
				var position = getDialoguePosition(id);
				var dialogue = dialogues[position];
				dialogue.character = $('#dialoguecharacteredit').val();
				dialogue.line1 = $('#dialogueline1edit').val();
				dialogue.line2 = $('#dialogueline2edit').val();
				dialogue.line3 = $('#dialogueline3edit').val();
				dialogue.line4 = $('#dialogueline4edit').val();

				$('#dialoguecharacteredit').remove();
				$('#dialogueline1edit'+id).remove();
				$('#dialogueline2edit'+id).remove();
				$('#dialogueline3edit'+id).remove();
				$('#dialogueline4edit'+id).remove();
				$('#dialoguecancel_'+id).remove();
				$('#dialogueedit_'+id).removeClass('btn-success');
				$('#dialogueedit_'+id).addClass('btn-primary');
				$('#dialogueedit_'+id).text('edit');

				setDialogue(dialogue, id);
			}
			/**
			 * Removes the input fields from the dialogue box and
			 * resets the values to the previous ones.
			 * @param 	id 	int, the dialogue's id
			 */
			function cancelEdition (id) {
				isEditing = false;
				var position = getDialoguePosition(id);
				var dialogue = dialogues[position];

				$('#dialoguecharacteredit').remove();
				$('#dialogueline1edit'+id).remove();
				$('#dialogueline2edit'+id).remove();
				$('#dialogueline3edit'+id).remove();
				$('#dialogueline4edit'+id).remove();
				$('#dialoguecancel_'+id).remove();
				$('#dialogueedit_'+id).removeClass('btn-success');
				$('#dialogueedit_'+id).addClass('btn-primary');
				$('#dialogueedit_'+id).text('edit');

				setDialogue(dialogue, id);
			}


			$('#dialogueform').submit(function (e) {
				e.preventDefault();
				var isLine1Empty = $('#dialogueline1').val() == "" ? true : false;
				var isLine2Empty = $('#dialogueline2').val() == "" ? true : false;
				var isLine3Empty = $('#dialogueline3').val() == "" ? true : false;
				var isLine4Empty = $('#dialogueline4').val() == "" ? true : false;
				if (!isLine1Empty || !isLine2Empty || !isLine3Empty || !isLine4Empty) {
					addDialogue();
					resetDialogue();
				}
			});
			$('#dialoguesave').submit(function (e) {
				e.preventDefault();
				downloadDialogue();
			});
			$('#dialoguereset').click(function (e) {
				resetDialogue();
			});
			$('#goup').click(function (e) {
				$(document).scrollTo(0, 300);
			});
			$('#dialoguesdrop').click(function (e) {
				dropDialogues();
			});
			$('#dialoguecharacter').change(function (e) {
				var imgUrl = ""
				if (this.value != "none")
					imgUrl = imgRoot+imgPrefix+this.value+imgSuffix+imgExt;
				$('#dialoguecharacterimg').attr("src", imgUrl);
			});
			resetDialogue();
			setSelection("dialoguecharacter", characterSelection);
		});