import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync, writeFileSync } from "fs";
import { exec, spawn } from "child_process";

const app = express();

app
.use(express.json())
.use(cors({ origin: "*" }))

app.post("/", (req, res)=> {
  const filePath = `${process.cwd()}/dist/${uuidv4()}.cpp`;
  const executablePath = `${filePath.replace(".cpp", ".exe")}`;
  
  let processTimeOutId: any = null

  const cleanUp = ()=> {
    clearTimeout(processTimeOutId);
    unlinkSync(filePath)
    unlinkSync(executablePath)
  }

  try {
    const { code } = req.body;
    
    writeFileSync(filePath, code);

    const command = `g++ ${filePath} -o ${executablePath}`;

    exec(command, (err, _, stderr)=>{

      if(err) {
        res.status(422).send({
          output: stderr,
          code: 1
        })
        return;
      }

      let output = ""
      const wc = spawn(executablePath);
      
      processTimeOutId = setTimeout(()=> { wc.kill("SIGKILL") }, 1000 * 3);

      wc.stdout.on('data', (data)=> {
        output += data.toString();
      });

      wc.stderr.on('data', (data)=> {
        output += data.toString();
      });

      wc.on('close', (code)=>{
        res.status(200).send({
          output,
          code: code == null ? -1 : code
        })

        cleanUp();
      });

    });

  } catch(err) {
    res.status(500).send({
      err: err.message
    })
    cleanUp();
  }
});

app.listen(8080,()=>{
  console.log(`server running on port: 8080`)
});
