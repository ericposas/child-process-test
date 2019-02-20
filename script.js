const cp = require('child_process')
const _var = process.argv[2]
const wc_flags = ['w','c']
const wc_terms = ['words','chars']
const wc = cp.spawn('wc', [`-${wc_flags[0]}${wc_flags[1]}`])
const echo = cp.spawn('echo', ['-n', _var]);

if(!_var) process.exit(0)

// Finally got this to work by using 'echo'. In Unix, 'wc' looks for a file path.
// If you try to pipe via process.stdin, it fails silently because 'open: No such file or directory' 
// But piping through echo's stdout to wc's stdin works and we can then attach the on 'data' event 
// Always check the command line piping first before piping commands here to make sure the data types
//  are matching. 

echo.stdout.pipe(wc.stdin)

//wc.on('close', code=>{ console.log(code) })

wc.stdout.on('data', data=>{
 data = data.toString().split(' ').filter(item=>item!='')
 data.forEach((item,i)=>{
  if(item.indexOf('\n') > 0){
   data[i]=item.slice(0,item.indexOf('\n'))  
  }
 })
 let _data = data.map((item,i) => ` ${wc_terms[i]}:${item}`)
 console.log(_data.toString())
})

