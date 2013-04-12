//jquery.player  
(function($) {
	/**/
	var _nn = 0;// 用来计算实时监听的条数的，超过100条记录就要删除，不然会消耗内存
	var options ;
	var box ;
	// 插件的定义
	$.fn.player = function(opt) {
		//debug(this);
		// build main options before element iteration
		var opts = $.extend({}, $.fn.player.defaults, opt);
		
		// iterate and reformat each matched element
		return this.each(function() {
			$this = $(this);
			// build element specific options
			options = $.meta ? $.extend({}, opts, $this.data()) : opts;

			$.fn.player.create();
			

		});
	};
	// 私有函数：debugging
	function debug($obj) {
		if (window.console && window.console.log)
			window.console.log('hilight selection count: ' + $obj.size());
	}
	;

	/*
	 * =================================================================
	 * 
	 * 以下代码并不是播放器里的，只是播放器应用时用到的
	 * 
	 * =================================================================
	 */
	function playerstop() {
		// 只有当调用视频播放器时设置e=0或4时会有效果
		alert('播放完成');
	}


	function aboutstr(str, f) {// 查看str字符里是否有f
		var about = false;
		var strarray = new Array();
		var farray = new Array();
		farray = f.split(",");
		if (str) {
			for ( var i = 0; i < farray.length; i++) {
				strarray = str.split(farray[i]);
				if (strarray.length > 1) {
					about = true;
					break;
				}
			}
		}
		return about;
	}
	function ckadjump() {
		alert("你点击了跳过广告按钮，注册成为本站会员，可不用观看前置广告");
	}
	//public method
	// 关灯
	$.fn.player.closeLights = function(txt) {
		var w=800,h=460;
		
		box.Show();
		$('#video').style.width = w + 'px';
		$('#video').style.height = h+ 'px';
		swfobject.getObjectById('ckplayer_a1').width = w;
		swfobject.getObjectById('ckplayer_a1').height = h;
	};
	// 开灯
	$.fn.player.openLights = function(txt) {
		box.Close();
		$('#video').style.width = options.width + 'px';
		$('#video').style.height = options.height + 'px';
		swfobject.getObjectById('ckplayer_a1').width = options.width;
		swfobject.getObjectById('ckplayer_a1').height = options.height;
	};	
	// create player
	$.fn.player.create = function() {
		var flashvars = options;
		var params = {
			bgcolor : '#FFF',
			allowFullScreen : true,
			allowScriptAccess : 'always'
		};// 这里定义播放器的其它参数如背景色（跟flashvars中的b不同），是否支持全屏，是否支持交互
		var attributes = {
			id : 'ckplayer_a1',
			name : 'ckplayer_a1'
		};
		var media = $('#media');
		media.empty();
		
		// 开关灯
		var light = $('<div id="flashcontent"></div>').appendTo(media);
		/*
		上面一行是播放器所在的容器名称，如果只调用flash播放器，可以只用<div id="a1"></div>
		而不需要使用<div id="html5" style="width:600;float: left;"><div id="a1"></div></div>
		目前是兼容html5和flash的
		*/			
		var video = $('<div id="video" style="position: relative; z-index: 100; "><div id="a1"></div></div>')
					.appendTo(media)
					.css({width:options.width,height:options.height});
		box = new LightBox('flashcontent');
		/*
		<div id="flashcontent"></div>
		<div id="video" style="position: relative; z-index: 100; width: 640px; height: 390px; float: left;"><div id="a1"></div></div>
		*/
		
		/**/
		// 下面一行是调用播放器了，括号里的参数含义：（播放器文件，要显示在的div容器，宽，高，需要flash的版本，当用户没有该版本的提示，加载初始化参数，加载设置参数如背景，加载attributes参数，主要用来设置播放器的id）
		swfobject.embedSWF(options.path+'ckplayer.swf', 'a1', options.width, options.height,
				'10.0.0', options.path+'expressInstall.swf', flashvars,
				params, attributes); // 播放器地址，容器id，宽，高，需要flash插件的版本，flashvars,params,attributes
		// 调用ckplayer的flash播放器结束
		
		/*
		 * 下面三行是调用html5播放器用到的 var video='视频地址和类型'; var support='支持的平台或浏览器内核名称';
		var video = {
			url : 'video/mp4'
		};
		var support = [ 'iPad', 'iPhone', 'ios' ];
		html5object.embedHTML5('video', 'ckplayer_a1', opt.width, opt.height, video,
				flashvars, support);
		*/
		/*
		if(opt.log){
			var fn_log = function ckplayer_status(str) {
				$.fn.player.log(str);
			}
		}
		*/
	};
	
	// LOG
	$.fn.player.log = function(txt) {
		var tmp='',
		text='<textarea rows="15" id="log"></textarea>',
		log_textarea ;
		
		log_textarea = $('#log');	
		if($('#log').length==0){
			$('#media').append(text);
			$('#log').css({width:options.width,height:options.height});
		}
		
		_nn += 1;
		
		if (_nn > 85) {
			_nn = 0;
			log_textarea.val('');
		}
		tmp =log_textarea.val();
		log_textarea.val(txt + '\n' + tmp);

	};	
	//defaults options
	$.fn.player.defaults = {
		f : 'url',// 视频地址
		a : '',// 调用时的参数，只有当s>0的时候有效
		s : '0',// 调用方式，0=普通方法（f=视频地址），1=网址形式,2=xml形式，3=swf形式(s>0时f=网址，配合a来完成对地址的组装)
		c : '0',// 是否读取文本配置,0不是，1是
		x : '',// 调用xml风格路径，为空的话将使用ckplayer.js的配置
		i : '',// 初始图片地址
		d : '',// 暂停时播放的广告，swf/图片,多个用竖线隔开，图片要加链接地址，没有的时候留空就行
		u : '',// 暂停时如果是图片的话，加个链接地址
		l : '',// 前置广告，swf/图片/视频，多个用竖线隔开，图片和视频要加链接地址
		r : '',// 前置广告的链接地址，多个用竖线隔开，没有的留空
		t : '',// 视频开始前播放swf/图片时的时间，多个用竖线隔开
		y : '',// 这里是使用网址形式调用广告地址时使用，前提是要设置l的值为空
		z : '',// 缓冲广告，只能放一个，swf格式
		e : '3',// 视频结束后的动作，0是调用js函数，1是循环播放，2是暂停播放，3是调用视频推荐列表的插件，4是清除视频流并调用js功能和1差不多
		v : '50',// 默认音量，0-100之间
		p : '0',// 视频默认0是暂停，1是播放
		h : '4',// 播放http视频流时采用何种拖动方法，=0不使用任意拖动，=1是使用按关键帧，=2是按时间点，=3是自动判断按什么(如果视频格式是.mp4就按关键帧，.flv就按关键时间)，=4也是自动判断(只要包含字符mp4就按mp4来，只要包含字符flv就按flv来)
		q : '',// 视频流拖动时参考函数，默认是start
		m : '0',// 默认是否采用点击播放按钮后再加载视频，0不是，1是,设置成1时不要有前置广告
		g : '',// 视频直接g秒开始播放
		j : '',// 视频提前j秒结束
		k : '',// 提示点时间，如 30|60鼠标经过进度栏30秒，60秒会提示n指定的相应的文字
		n : '',// 提示点文字，跟k配合使用，如 提示点1|提示点2
		b : '0x000',// 播放器的背景色，如果不设置的话将默认透明
		w : '',// 指定调用自己配置的文本文件,不指定将默认调用和播放器同名的txt文件
		// 调用播放器的所有参数列表结束
		// 以下为自定义的播放器参数用来在插件里引用的
		path:'assets/ckplayer/',//ckplayer相对路径
		my_url : 'ckhtm',// 本页面地址
		//以下为jquery.player配置的option项，与ckplayer不兼容
		width:640,//播放器宽度
		height:390,//播放器高度
		log:false //是否开启LOG，在Debug时有用,因为前端调用方法问题，此功能暂时未实现
	};
	// 闭包结束
})(jQuery);