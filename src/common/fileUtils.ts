import {SourceFile} from "../renderer/state";
import {remote} from "electron";
import * as path from "path";
import * as moment from "moment";

export function getSourceFilesFromPaths(sourceFilePaths: string[]): SourceFile[] {
    const electronFs = remote.require("fs");
    let validSourceFiles: SourceFile[] = [];

    for (let filePath of sourceFilePaths) {
        if (filePath.endsWith(".nc")) {
            const stats = electronFs.statSync(filePath);
            const fileName = path.parse(filePath).base;
            validSourceFiles.push({
                name: fileName,
                path: filePath,
                size: stats.size / (1024 * 1024),
                lastUpdated: moment(stats.mtime.toISOString()).format("DD/MM/YY, hh:mm:ss"),
                globalMetadata: []
            });
        }
    }
    return validSourceFiles;
}

export function getSourceFiles(sourceFileDirectory: string): SourceFile[] {
    const electronFs = remote.require("fs");
    let validSourceFiles: SourceFile[] = [];
    let sourceFiles: string[] = [];
    try {
        sourceFiles = electronFs.readdirSync(sourceFileDirectory);
    } catch (e) {
        console.warn("There is no input directory in this workspace.")
    }

    for (let fileName of sourceFiles) {
        if (fileName.endsWith(".nc")) {
            const filePath = path.join(sourceFileDirectory, fileName);
            const stats = electronFs.statSync(filePath);
            validSourceFiles.push({
                name: fileName,
                path: filePath,
                size: stats.size / (1024 * 1024),
                lastUpdated: moment(stats.mtime.toISOString()).format("DD/MM/YY, hh:mm:ss"),
                globalMetadata: []
            });
        }
    }
    return validSourceFiles;
}

export function getDirectory(sourceFilePath: string): string {
    return sourceFilePath.match(/(.*)[\/\\]/)[1] || '';
}

export function constructInputDirectory(workspaceDir: string) {
    return path.join(workspaceDir, "inputs");
}

export function constructOutputDirectory(workspaceDir: string, configName: string) {
    return path.join(workspaceDir, "configs", configName, "outputs");
}
