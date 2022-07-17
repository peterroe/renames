import fs from 'fs'
import path from 'path'

/**
 * @description: rename file
 * @param {*} nameMap
 * @param {*} dir
 */
export function renameFile(nameMap, dir) {
  nameMap.forEach(([oldFileName, newFileName]) => {
    fs.renameSync(path.join(dir, oldFileName), path.join(dir, newFileName))
  })
}
