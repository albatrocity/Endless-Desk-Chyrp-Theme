jQuery.fn.jTwitter = function(args) {
	if(String(typeof this).toLowerCase() != 'object') { return; }
	
	var $ = jQuery;
	var jTwitter = $.fn.jTwitter;
	
	jTwitter.defaults = {
		'username': null,
		'limit': 20,
		'refresh': false,
		'newReplacesOld': true,
		'useFullName': false,
		'timeFormat': false,
		'showDate': true,
		'showSource': true,
		'showInReplyTo': true,
		'showOriginal': true,
		'showAvatar': true,
		'convertLinks': true
	}

	var options = {};

	if(String(typeof args).toLowerCase() == 'object') {
		$.each(jTwitter.defaults, function(i,o){
			options[i] = (typeof args[i] != 'undefined' ? args[i] : jTwitter.defaults[i]);
		});
	} else if(String(typeof args).toLowerCase() == 'string') {
		options['username'] = args;
	} else {
		options = jTwitter.defaults;
	}
	
	if(options.limit > 200) { options.limit = 200; } // Respect Twitter's count limit
	
	if(options.username == null) { return; }

	if(typeof jTwitter.list == 'undefined') {
		jTwitter.list = jQuery(jQuery('<ul class="jtwitter"></ul>'));
		this.append(jTwitter.list);
		var refreshing = false;
	} else {
		jTwitter.list.children('li.new').removeClass('new');
		var refreshing = true;
	}
	
	var url = 'http://twitter.com/statuses/user_timeline/' + options.username + '.json?callback=?';
	
	jQuery.getJSON(
		url,
		{
			'count': options.limit
		},
		function(json) {
			if(refreshing && newReplacesOld) { jTwitter.list.empty(); }
			jTwitter.processTweets(json);
		}
	);
	
	jTwitter.processTweets = function(tweets) {
		$.each(tweets,function() {
			var tweet = this;
			var in_reply_to = (tweet.in_reply_to_status_id ? '<a href="http://twitter.com/' + tweet.in_reply_to_screen_name + '/statuses/' + tweet.in_reply_to_status_id + '/" class="reply">in reply to ' + tweet.in_reply_to_screen_name + '</a>' : false);
			if(options.convertLinks) {
				tweet.text = tweet.text.replace(/(http:\/\/([^\s]+))/,'<a class="inline" href="$1">$1</a>').replace(/@([A-Za-z0-9_-]+)/g,'<a href="http://twitter.com/$1" class="user" title="@$1">@$1</a>').replace(/#([A-Za-z0-9_-]+)/g,'<a href="http://search.twitter.com/search?q=%23$1" class="topic" title="#$1">#$1</a>');
			}
			var listItem = $(jQuery('<li class="tweet"></li>'));
			if(refreshing && !newReplacesOld) { listItem.addClass('new'); }
			var userUrl = 'http://twitter.com/' + tweet.user.screen_name + '/';
			var tweetUsername = (tweet.user.name == '' && !useFullName ? tweet.user.screen_name : tweet.user.name);
			var html = '';
			if(options.showAvatar) {
				html += '<a href="' + userUrl + '" class="avatar"><img src="' + tweet.user.profile_image_url + '" class="avatar" /></a> ';
			}
			html += '<a href="' + userUrl + '" class="username" title="' + tweetUsername + '">' + tweetUsername + '</a> ';
			html += '<span class="text">' + tweet.text + '</span> ';
			if(options.showDate) {
				html += '<span class="date">' + (options.timeFormat ? new Date(tweet.created_at).toLocaleFormat(options.timeFormat) : new Date(tweet.created_at).toLocaleFormat()) + '</span> ';
			}
			if(options.showInReplyTo && in_reply_to) {
				html += in_reply_to + ' ';
			}
			if(options.showSource) {
				html += '<span class="from">from ' + tweet.source + '</span> ';
			}
			if(options.showOriginal) {
				html += '<a class="view-original" href="http://twitter.com/' + tweet.user.screen_name + '/statuses/' + tweet.id + '/">view on Twitter</a>';
			}
			listItem.html(html)
			listItem.appendTo(jTwitter.list);
		});
	}
	
	if(options.refresh) {
		setInterval(function(){
			this.jTwitter(args);
		},(options.refresh >= 5000 ? options.refresh : options.refresh * 1000))
	}
	
	return this;
}

jQuery.fn.jtwitter = jQuery.fn.jTwitter;