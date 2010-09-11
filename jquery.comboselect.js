// jQuery comboselect plugin
//
// version 2.0.0

// Versions 2+ represent a reworking of the plugin.  See Jason Huck's site for the original
// I used spring board. http://devblog.jasonhuck.com/
// 
// This reworking add efficiency and some options and a bug fix for the invalid markup.
// Its also done with jQuery 1.4 in mind.
// Sorting is removed for the time being.

// ------------------------------------------------------------------------------------
//
// Transforms a single select element into a pair of multi-selects
// with controls to move items left to right and vice versa.
// items are submitted by the original form element. Double-clicking 
// moves an item from one side to the other.
//
// 
// Usage: $('#myselect').comboselect({
// 		addbtn: [string,default:' &gt; '], 						// label for the "add" button
// 		rembtn: [string,default:' &lt; ']						// label for the "remove" button
// });
//
// Version History
// 2.0.0 Reworking release, no sorting
// 1.0.2	Now works correctly if the form is not the immediate parent of the select.
//			Clears originally selected options before updating with user's new selections on submit.
//			Correctly transforms selects whose options were added dynamically. 
// 1.0.1	Correctly transforms inputs which already had options selected.
// 1.0.0	Initial release.


(function($){
	jQuery.fn.comboselect = function(settings){
		settings = jQuery.extend({
			sort: 'both',		// which sides to sort: none, left, right, or both
			addbtn: ' &gt; ',	// text of the "add" button
			rembtn: ' &lt; '	// text of the "remove" button
		}, settings);
	
		this.each(function(){
			// the id of the original element
			var selectID = this.id;
			
			// ids for the left and right sides
			// of the combo box we're creating
			var leftID = selectID + '_left';
			var rightID = selectID + '_right';
			
			// the form which contains the original element
			var theForm = $(this).parents('form');
			
			// place to store markup for the combo box
			var combo = '';
			
			// copy of the options from the original element
			
			// var opts = $(this).children().clone();
			var opts = $(this).find('option').clone();
			
			// add an ID to each option for the sorting plugin
			opts.each(function(){
				$(this).attr('id', $(this).attr('value'));
			});
			// build the combo box
			combo += '<fieldset class="comboselect">';
			combo += '<select id="' + leftID + '" name="' + leftID + '" class="csleft" multiple="multiple">';
			combo += '</select>';
			combo += '<fieldset>';
			combo += '<input type="button" class="csadd" id="' + selectID + '_add" value="' + settings.addbtn + '" />';
			combo += '<input type="button" class="csremove" id="' + selectID + '_remove" value="' + settings.rembtn + '" />';
			combo += '</fieldset>';
			combo += '<select id="' + rightID + '" name="' + rightID + '" class="csright" multiple="multiple">';
			combo += '</select>';
			combo += '</fieldset>';		
		
			// hide the original element and 
			// add the combo box after it
			$(this).hide().after(combo);			

			// find the combo box in the DOM and append
			// a copy of the options from the original
			// element to the left side
			theForm.find('#' + leftID).append(opts);
			
			// bind a submit event to the enclosing form
			theForm.submit(function(){
				// clear the original form element of selected options
				$('#' + selectID).find('option:selected').removeAttr('selected');	
			
				// look at each option element
				// from the right side...
				$('#' + rightID).find('option').each(function(){
					// select the corresponding option
					// from the original element
					var v = $(this).attr('value');
					$('#' + selectID).find('option[value="' + v + '"]').attr('selected','selected');
				});
				
				return true;
			});			
		});

		// double-click moves an item to the other list
		$('select.csleft').dblclick(function(){
			$(this).parent().find('fieldset input.csadd').click();
		});
		
		$('select.csright').dblclick(function(){
			$(this).parent().find('fieldset input.csremove').click();
		});

		// add/remove buttons
		$('input.csadd').click(function(){
			var left = $(this).parent().parent().find('select.csleft');
			var leftOpts = $(this).parent().parent().find('select.csleft option:selected');
			var right = $(this).parent().parent().find('select.csright');
			right.append(leftOpts);
			sortBoxes(left.attr('id'), right.attr('id'));	
		});
	
		$('input.csremove').click(function(){
			var left = $(this).parent().parent().find('select.csleft');
			var right = $(this).parent().parent().find('select.csright');
			var rightOpts = $(this).parent().parent().find('select.csright option:selected');
			left.append(rightOpts);
			sortBoxes(left.attr('id'), right.attr('id'));
		});			

		// sort the boxes and clear highlighted items
		function sortBoxes(leftID, rightID){
			var toSort = null;
			
			switch(settings.sort){
				case 'none': toSort = null;
				case 'left': toSort = $('#' + leftID); break;
				case 'right': toSort = $('#' + rightID); break;
				default: toSort = $('#' + leftID + ', #' + rightID);					
			}
		
			if(settings.sort != 'none'){
				toSort.find('option').selso({
					type: 'alpha', 
					extract: function(o){ return $(o).text(); } 
				});
			}
			
			// clear highlights
			try {
			  $('#' + leftID + ', #' + rightID).find('option:selected').removeAttr('selected');
	    } catch (e) { }
		}			
		
		// add any items that were already selected
		$('input.csadd').click();
	
		return this;
	};	
})(jQuery);
