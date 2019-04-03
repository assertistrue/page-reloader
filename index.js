var request = require('request')

const ArgumentParser  = require('argparse').ArgumentParser;
var argsParser = new ArgumentParser({ addHelp:true, description:"redis cache shell" , debug: true });
argsParser.addArgument(["--URL", "-u"], { help:"url of page to be loaded", required:true })
argsParser.addArgument(["--DisplayLength", "-c"], { help:"Number of characters to be displayed from the response body", required:false, defaultValue:25 })
argsParser.addArgument(["--Timeout", "-t"], { help:"timeout in seconds", required:false, defaultValue:10 })
argsParser.addArgument(["--CallCount", "-n"], { help:"Number of times to call the URL.", required:false, defaultValue:5 })
argsParser.addArgument(["--WaitTime", "-w"], { help:"waiting time in seconds between calls.", required:false, defaultValue:3 })

var args;
try {
    args = argsParser.parseArgs();
    console.dir(args);
} catch (error) {
    argsParser.error(`Error:${error!=null?error:"Unknown error"}`);
    argsParser.exit();
}

var opts = {
  url: args.URL,
  timeout: args.Timeout*1000
}

function callingPage(cnt){
    console.log(`in callingPage:${cnt}`);
    request(opts, function (err, res, body) {
        if (err) {
            console.dir(err)
        }else{
            console.log('status code: ' + res.statusCode)
            console.log(`body:${res.body.substring(0,args.DisplayLength)}`)
        }

        if (cnt < args.CallCount){
            setTimeout( function(){callingPage(cnt + 1)}, args.WaitTime * 1000);
        }else{
            console.log("end of calls");
        }
    });
}

callingPage(1);

