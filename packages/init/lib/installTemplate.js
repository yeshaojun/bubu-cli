import fse from "fs-extra"
import path from "node:path"
import { log } from "@bubu/utils"
import { pathExistsSync } from "path-exists" 
import ora from "ora"

function getCacheFilePath(targetPath, template) {
    return path.resolve(targetPath, 'node_modules', template.npmName, 'template')
}


function copyFile(targetPath, template, installDir) {
    const originFile = getCacheFilePath(targetPath, template)
    const fileList = fse.readFileSync(originFile)
    const spinner = ora('正在拷贝模板文件').start()
    fileList.forEach(file => {
        fse.copySync(`${originFile}/${file}`, `${installDir}/${file}` )
    })
    spinner.stop()
    log.info('模板拷贝成功！')
}

export default function installTemplate(selectTemplate, opts) {
    const { force = false } = opts
    console.log('force', force)
    const { targetPath,name,  template } = selectTemplate
    const rootDir = process.cwd()
    fse.ensureDirSync(targetPath)
    const installDir = path.resolve(`${rootDir}/${name}`)
    console.log(installDir)
    if(pathExistsSync(installDir)) {
        if(force) {
            fse.removeSync(installDir)
            fse.ensureDirSync(installDir)
        } else {
            log.error('目录已存在')
        }
    } else {
        fse.ensureDirSync(installDir)
    }
    copyFile(targetPath, template, installDir)

}