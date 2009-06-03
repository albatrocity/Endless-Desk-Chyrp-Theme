$(document).ready(function()
{
	slide("#nav ul", 15, 10, 50, 1);
});

function slide(navigation_id, pad_out, pad_in, time, multiplier)
{
	var list_elements = navigation_id + " li";
	var link_elements = list_elements + " a";


	$(link_elements).each(function(i)
	{
		$(this).hover(
		function()
		{
			$(this).animate({ paddingLeft: pad_out }, 150);
		},		
		function()
		{
			$(this).animate({ paddingLeft: pad_in }, 150);
		});
	});
}