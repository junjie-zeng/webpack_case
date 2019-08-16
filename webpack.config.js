const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');//压缩
const htmlPlugin = require('html-webpack-plugin'); //html模板生成
const extractTextPlugin = require('extract-text-webpack-plugin');//css分离
const glob = require('glob');
const purifyCssPlugin = require('purifycss-webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');






/*var website ={
	//publicPath:'http:192.168.1.108:1888/'
	publicPath:'localhost:1888'
}
*/


module.exports = {
	//入口文件配置项
	
	/*entry:{//下面为多个文件时，同时打包会生成多个对应文件（下面属性文件名可以随便取）
        entry:'./src/js/entery.js',
        test:'./src/js/test.js' 
	},*/
	devtool:'eval-source-map', //用于调试，会在目录生成一个源文件
	entry:['./src/index.js','./src/js/entery.js','./src/js/test.js'],

	//出口文件配置项
	output:{
		//打包的路径
		path:path.resolve(__dirname,'dist'),
		
		//filename:'bundle.js' //打包文件名称 单个文件时
		
		//filename:'[name].js',//多个文件时
		
        filename:'index.js' //多个文件合并为一个文件

		//publicPath:website.publicPath  //todo 路径问题



	},
	//模块：例如解读css 图片如何转换，压缩
	module:{
		rules:[
            {
            	test:/\.css$/,
            	//use:['style-loader','css-loader']
            	use:extractTextPlugin.extract({
            		fallback:'style-loader',
            		use:'css-loader'
            	})
            },
            /*{ //postcss 自动给css3属性添加前缀 ，打包有错误
                test:/\.css$/,
                use:[
                    {loader:'style-loader'},
                    {
                    	loader:'css-loader',
                    	options:{
                    		modules:true
                    	}

                    },{
                    	loader:'postcss-loader'
                    }

                ]
            },*/

            {
            	test:/\.(png|jpg|gif)/, //匹配文件后缀
            	use:[{//使用loade的配置参数
            		   loader:'url-loader',
            		   options:{
            		   	   limit:500000, //小于500000的文件打包成Base64的格式，写入js
            		       outputPath:'images/'
            		   }

                    }]

            },
            {//解决html文件中引入图片标签的问题
                test:/\.(htm|html)$/i,
                use:[ 'html-withimg-loader']
            },
            {//less
            	test:/\.less$/,
            	/*use:[ 此方法未将css代码独立出来
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'less-loader'}
            	]*/

            	use:extractTextPlugin.extract({
            		use:[
	                    {loader:'css-loader'},
	                    {loader:'less-loader'}                       
            		],
            		fallback:'style-loader'
            	})
            },
            //sass
            {
            	test:/\.scss$/,
            	/*use:[//此方法只是在head中引入了css
            	    {loader:'style-loader'},
            	    {loader:'css-loader'},
            	    {loader:'sass-loader'}
            	]*/
            	use:extractTextPlugin.extract({
            		use:[
                        {loader:'css-loader'},
                        {loader:'sass-loader'}
            		],
            		fallback:'style-loader'
            	})

            },
            //支持es6
            {
            	test:/\.(jsx|js)$/,
            	use:{
            		loader:'babel-loader',
            		/*options:{ //有 .babel文件所以可以不用这一段
            			presets:['es2015',"react"]
            		}*/
            	},
            	exclude:/node_modules/
            }
            
   
		]
		
	},
	//插件用于生产模板和各项功能
	plugins:[
	    new uglify(),//代码压缩

	    new htmlPlugin({ //html生成
			minify:{ //对html文件进行压缩
		    	removeAttributeQuotes:true //去掉属性的双引号
		    },
		    hash:true, //避免缓存,会生成版本号
		    template:'./src/index.html' //需要打包的模板路径	   	
	    }),
	    //css less 都会合并在这个文件中
	    new extractTextPlugin('css/index.css'), //分离路径位置(可以new多个，现在是打包后全都放在一个文件)
      
        //配置 消除未使用的css
        new purifyCssPlugin({
        	paths:glob.sync(path.join(__dirname,'src/*.html')),
        }),

        //静态资源集中输出
       /* new copyWebpackPlugin([
	        {
	        	from:__dirname + 'src/images',
	        	to:'./public/images'
	        }
        ])*/



	],
	//配置webpack 开发服务功能 (首先得安装 webpack-dev-server)
	devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1888
    }
	
}