/**
 * Blockly 积木点击高亮工具函数
 * 统一处理积木点击事件，生成代码并定位行号
 * 支持多个相同积木的精确定位
 */

//import Blockly from 'blockly';
import * as Blockly from 'blockly/core';

/**
 * 查找积木代码在标记代码中的准确行号
 * 当有多个相同积木时，通过精确匹配 blockId 来确定最准确的行号
 * 
 * @param {string} codeWithMarker - 带标记的完整代码
 * @param {string} blockId - 当前积木的ID
 * @param {string} blockCode - 当前积木生成的代码
 * @returns {number} 行号（0-based），如果未找到返回 -1
 */
function findAccurateLineNumber(codeWithMarker, blockId, blockCode) {
  const lines = codeWithMarker.split('\n');
  
  // Blockly 的 STATEMENT_PREFIX 中的 %1 会被替换为当前语句块的 ID
  // 注意：blockId 可能被单引号包裹，格式可能是：
  // - # block_id:${blockId}
  // - # block_id:'${blockId}'
  // 我们需要同时匹配这两种格式
  const markers = [
    `# block_id:${blockId}`,           // 无引号格式
    `# block_id:'${blockId}'`,         // 单引号格式
    `# block_id:"${blockId}"`,         // 双引号格式（备用）
  ];
  
  // 查找所有匹配该 blockId 的行
  const matchingLines = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 检查是否包含任一格式的标记
    for (const marker of markers) {
      if (line === marker || line.includes(marker)) {
        matchingLines.push(i);
        break; // 找到匹配就跳出内层循环
      }
    }
  }
  
  // 如果没有匹配，返回 -1
  if (matchingLines.length === 0) {
    // console.warn(`[highlight] No matching line found for blockId ${blockId}`);
    return -1;
  }
  
  // 返回标记行的行号（不是代码行）
  // 调用者会根据标记行找到对应的代码行，然后在干净代码中匹配
  if (matchingLines.length === 1) {
    return matchingLines[0];
  }
  
  // 如果有多个匹配，通过比较代码内容来确定最准确的那个
  const blockCodeLines = blockCode.split('\n').filter(l => l.trim());
  let bestMatch = matchingLines[0];
  let bestScore = 0;
  
  for (const markerLineIdx of matchingLines) {
    // 检查标记行后面的代码是否匹配当前积木的代码
    let score = 0;
    const maxCheckLines = Math.min(blockCodeLines.length, 10); // 最多检查10行
    
    // 从标记行的下一行开始比较（因为标记行是注释）
    for (let i = 0; i < maxCheckLines && (markerLineIdx + 1 + i) < lines.length; i++) {
      const actualLine = lines[markerLineIdx + 1 + i].trim();
      const expectedLine = blockCodeLines[i].trim();
      
      // 跳过空行
      if (!actualLine || !expectedLine) continue;
      
      // 精确匹配得分最高
      if (actualLine === expectedLine) {
        score += 20; // 提高精确匹配的权重
      } 
      // 包含匹配得分次之
      else if (actualLine.includes(expectedLine) || expectedLine.includes(actualLine)) {
        score += 5;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = markerLineIdx;
    }
  }
  
  // 返回标记行的行号
  return bestMatch;
}

/**
 * 获取积木链中的最后一个积木
 * @param {Object} block - Blockly 积木对象
 * @returns {Object} 最后一个积木
 */
function getLastBlockInChain(block) {
  let currentBlock = block;
  while (currentBlock && currentBlock.getNextBlock()) {
    currentBlock = currentBlock.getNextBlock();
  }
  return currentBlock;
}

/**
 * 统一的积木点击处理函数
 * @param {Object} event - Blockly 事件对象
 * @param {Object} workspace - Blockly workspace 实例
 * @param {Function} onSuccess - 成功回调函数，接收 { blockCode, workspaceCode, startLine, endLine }
 * @param {Function} onError - 错误回调函数，接收错误对象
 * @returns {boolean} 是否处理了该事件
 */
export function handleBlockClick(event, workspace, onSuccess, onError) {
  // 只处理点击事件
  if (event.type !== Blockly.Events.UI || event.element !== 'click') {
    return false;
  }

  const blockId = event.blockId;
  if (!blockId) {
    return false;
  }

  const block = workspace.getBlockById(blockId);
  if (!block) {
    return false;
  }

  // ==== 通用高亮策略 ====
  // 2) 通用"父块高亮整段"：只要有语句输入（BODY、PARAMS_BODY、RUN_BODY等），就高亮其中所有子积木对应的代码范围
  // 注意：这个检查要在主程序检查之前，因为有些积木（如face_recog_run_main）有语句输入但不应该高亮全局
  const statementInputs = ['BODY', 'PARAMS_BODY', 'RUN_BODY', 'DO'];
  let hasStatementInput = false;
  let firstStatementBlock = null;
  let lastStatementBlock = null;
  
  for (const inputName of statementInputs) {
    if (typeof block.getInputTargetBlock === 'function') {
      const targetBlock = block.getInputTargetBlock(inputName);
      if (targetBlock) {
        hasStatementInput = true;
        if (!firstStatementBlock) {
          firstStatementBlock = targetBlock;
        }
        // 找到该输入链的最后一个积木
        const lastInChain = getLastBlockInChain(targetBlock);
        if (lastInChain) {
          lastStatementBlock = lastInChain;
        }
      }
    }
  }
  
  if (hasStatementInput && firstStatementBlock) {
    // 工具函数：获取某个子积木的高亮范围（startLine, endLine）
    const getRangeForBlock = (b) => {
      let range = { startLine: -1, endLine: -1 };
      const fakeEvent = {
        type: Blockly.Events.UI,
        element: 'click',
        blockId: b.id
      };
      // 递归调用当前高亮逻辑，但使用本地的回调捕获结果，不影响外层 onSuccess
      handleBlockClick(
        fakeEvent,
        workspace,
        ({ startLine, endLine }) => {
          range.startLine = startLine;
          range.endLine = endLine;
        },
        () => {}
      );
      return range;
    };

    // 获取当前积木自己生成的代码的起始行和结束行
    // 通过查找当前积木生成的代码的完整范围来定位
    const getSelfRange = () => {
      try {
        const normalize = (c) => Array.isArray(c) ? (c[0] || '') : (c || '');
        const blockCode = normalize(Blockly.Python.blockToCode(block));
        const workspaceCode = Blockly.Python.workspaceToCode(workspace);
        
        // 获取当前积木生成的代码的所有行（包括空行）
        const blockCodeLines = blockCode.split('\n');
        const blockCodeNonEmptyLines = blockCodeLines.filter(line => line.trim());
        
        if (blockCodeNonEmptyLines.length > 0) {
          const firstLine = blockCodeNonEmptyLines[0].trim();
          const lastLine = blockCodeNonEmptyLines[blockCodeNonEmptyLines.length - 1].trim();
          const lines = workspaceCode.split('\n');
          
          // 查找第一行和最后一行在完整代码中的位置
          // 从 BODY 中第一个子积木的起始行向前查找，找到当前积木代码的起始行
          const firstChildRange = getRangeForBlock(firstStatementBlock);
          let startLine = -1;
          let endLine = -1;
          
          if (firstChildRange.startLine >= 0) {
            // 从第一个子积木的起始行向前查找第一行
            for (let i = firstChildRange.startLine; i >= 0; i--) {
              if (lines[i].trim() === firstLine) {
                startLine = i;
                break;
              }
            }
            
            // 从最后一个子积木的结束行向后查找最后一行
            if (lastStatementBlock) {
              const lastChildRange = getRangeForBlock(lastStatementBlock);
              if (lastChildRange.endLine >= 0) {
                // 从最后一个子积木的结束行向后查找最后一行
                for (let i = lastChildRange.endLine; i < lines.length; i++) {
                  if (lines[i].trim() === lastLine) {
                    endLine = i;
                    break;
                  }
                }
              }
            }
          }
          
          // 如果没找到，在整个代码中查找
          if (startLine < 0) {
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].trim() === firstLine) {
                startLine = i;
                break;
              }
            }
          }
          
          if (endLine < 0 && startLine >= 0) {
            // 如果没找到最后一行，从开始行向后查找
            for (let i = startLine; i < lines.length; i++) {
              if (lines[i].trim() === lastLine) {
                endLine = i;
                break;
              }
            }
          }
          
          if (startLine >= 0) {
            return { 
              startLine, 
              endLine: endLine >= 0 ? endLine : startLine 
            };
          }
        }
      } catch (e) {
        console.error('[highlight] getSelfRange error', e);
      }
      return { startLine: -1, endLine: -1 };
    };

    // 对于有多个 statement 输入的积木（如 face_recog_run_main），需要找到所有输入的范围
    let allRanges = [];
    for (const inputName of statementInputs) {
      if (typeof block.getInputTargetBlock === 'function') {
        const targetBlock = block.getInputTargetBlock(inputName);
        if (targetBlock) {
          const lastInChain = getLastBlockInChain(targetBlock);
          const firstRange = getRangeForBlock(targetBlock);
          const lastRange = lastInChain ? getRangeForBlock(lastInChain) : firstRange;
          if (firstRange.startLine >= 0) {
            allRanges.push({
              startLine: firstRange.startLine,
              endLine: lastRange.endLine >= 0 ? Math.max(firstRange.endLine, lastRange.endLine) : firstRange.endLine
            });
          }
        }
      }
    }

    // 获取当前积木自己生成的代码的起始行
    const selfRange = getSelfRange();

    if (allRanges.length > 0 || selfRange.startLine >= 0) {
      // 合并当前积木自己的代码范围和子积木的范围
      const candidateStarts = [];
      const candidateEnds = [];
      
      if (selfRange.startLine >= 0) {
        candidateStarts.push(selfRange.startLine);
        candidateEnds.push(selfRange.endLine >= 0 ? selfRange.endLine : selfRange.startLine);
      }
      
      allRanges.forEach(range => {
        candidateStarts.push(range.startLine);
        candidateEnds.push(range.endLine);
      });

      const startLine = candidateStarts.length > 0 ? Math.min(...candidateStarts) : -1;
      const endLine = candidateEnds.length > 0 ? Math.max(...candidateEnds) : startLine;

      if (startLine >= 0 && typeof onSuccess === 'function') {
        const normalize = (c) => (Array.isArray(c) ? c[0] || '' : (c || ''));
        const blockCode = normalize(Blockly.Python.blockToCode(block));
        const workspaceCode = Blockly.Python.workspaceToCode(workspace);
        onSuccess({
          blockCode,
          workspaceCode,
          startLine,
          endLine: endLine >= 0 ? endLine : startLine
        });
        return true;
      }
    }
    // 如果没有有效范围，则继续走默认逻辑
  }

  // 1) 主程序标志积木：类型名以 `_main` 结尾时，高亮整份代码（适用于各类"主程序"块）
  // 注意：这个检查要在 statement 输入检查之后，避免有 statement 输入的积木被误判为主程序
  if (/_main$/.test(block.type)) {
    try {
      const workspaceCode = Blockly.Python.workspaceToCode(workspace);
      const lines = workspaceCode.split('\n');
      const lastLine = lines.length > 0 ? lines.length - 1 : 0;
      if (typeof onSuccess === 'function') {
        onSuccess({
          blockCode: workspaceCode,
          workspaceCode,
          startLine: 0,
          endLine: lastLine
        });
      }
      return true;
    } catch (e) {
      console.error('[highlight] main-block highlight error', e);
      // 出错则回退到通用逻辑
    }
  }

  // 只高亮当前积木本身，不跟随后续连接的积木（特殊积木在上方已处理）
  const hasNextBlock = false;
  const lastBlock = block;

  try {
    // 确保 definitions_ 存在，避免部分积木 generator 未初始化时报错
    Blockly.Python.definitions_ = Blockly.Python.definitions_ || Object.create(null);
    
    // 获取积木代码（仅当前积木，不包含后续连接的积木）
    const normalize = (c) => Array.isArray(c) ? (c[0] || '') : (c || '');
    const nextConnection = block.nextConnection;
    const nextTargetConnection = nextConnection?.targetConnection || null;

    // 临时断开后续积木，生成代码时只保留当前积木
    if (nextConnection && nextTargetConnection) {
      nextConnection.disconnect();
    }

    const raw = Blockly.Python.blockToCode(block);
    const blockCode = normalize(raw);

    // 生成完成后恢复连接，避免影响工作区结构
    if (nextConnection && nextTargetConnection) {
      nextConnection.connect(nextTargetConnection);
    }

    // 使用全局 STATEMENT_PREFIX 给所有语句打上 block_id 标记，再解析行号
    const generator = Blockly.Python;
    const originalPrefix = generator.STATEMENT_PREFIX;
    const originalSuffix = generator.STATEMENT_SUFFIX;
    let markerLine = -1;
    let endMarkerLine = -1;
    let codeWithMarker = ''; // 在外部定义，确保作用域正确
    
    try {
      // 临时修改 generator 配置，添加 block_id 标记
      // %1 会被 Blockly 替换为当前语句块的 ID（blockId）
      generator.STATEMENT_PREFIX = '# block_id:%1\n';
      generator.STATEMENT_SUFFIX = '';
      generator.init(workspace);
      
      // 生成带标记的代码
      codeWithMarker = generator.workspaceToCode(workspace);
      
      // 使用智能匹配算法查找准确的行号
      markerLine = findAccurateLineNumber(codeWithMarker, blockId, blockCode);
      
      // 如果有后续积木，查找最后一个积木的标记行
      if (hasNextBlock && lastBlock.id !== blockId) {
        const lastBlockCode = normalize(Blockly.Python.blockToCode(lastBlock));
        endMarkerLine = findAccurateLineNumber(codeWithMarker, lastBlock.id, lastBlockCode);
      }
      
    } catch (err) {
      console.error('[highlight] marker generation failed', err);
      codeWithMarker = ''; // 确保即使出错也有值
    } finally {
      // 恢复原始配置
      generator.STATEMENT_PREFIX = originalPrefix;
      generator.STATEMENT_SUFFIX = originalSuffix;
      generator.init(workspace);
    }

    // 生成干净的代码给右侧编辑器使用
    const workspaceCode = Blockly.Python.workspaceToCode(workspace);
    
    // 将标记代码中的行号转换为干净代码中的行号
    // 关键：通过统计标记行之前的实际代码行数来精确定位
    let finalLine = markerLine;
    let finalEndLine = -1;
    
    // 计算当前积木生成的代码行数（包括空行）
    const blockCodeLines = blockCode.split('\n');
    const blockCodeLineCount = blockCodeLines.length;
    
    // 如果 markerLine 为 -1，说明这是链的第一个块（没有标记）
    // 需要通过匹配代码内容来找到位置
    if (markerLine < 0 && blockCode) {
      const cleanLines = workspaceCode.split('\n');
      
      // 获取块代码的第一行非空内容
      let firstNonEmptyLine = '';
      for (const bline of blockCodeLines) {
        const trimmed = bline.trim();
        if (trimmed) {
          firstNonEmptyLine = trimmed;
          break;
        }
      }
      
      if (firstNonEmptyLine) {
        // 在干净代码中查找这个第一行的位置
        // 从代码开头开始查找，找到第一个匹配的位置
        for (let i = 0; i < cleanLines.length; i++) {
          if (cleanLines[i].trim() === firstNonEmptyLine) {
            finalLine = i;
            break;
          }
        }
      }
      
      // 如果找到了开始行，计算结束行
      if (finalLine >= 0) {
        const blockCodeNonEmptyLines = blockCodeLines.filter(l => l.trim()).length;
        let nonEmptyLineCount = 0;
        let actualEndLine = finalLine;
        
        // 从开始行向后查找，直到找到足够的非空行
        for (let i = finalLine; i < cleanLines.length; i++) {
          const cleanLine = cleanLines[i].trim();
          if (cleanLine) {
            nonEmptyLineCount++;
            // 当找到足够的非空行时，确定结束行
            if (nonEmptyLineCount >= blockCodeNonEmptyLines) {
              actualEndLine = i;
              break;
            }
          }
          // 空行也算作一行，继续向后查找
          actualEndLine = i;
        }
        
        // 如果没找到足够的行，使用代码的最后一行
        finalEndLine = Math.min(actualEndLine, cleanLines.length - 1);
      }
    }
    
    if (markerLine >= 0 && codeWithMarker) {
      const codeLines = codeWithMarker.split('\n');
      const cleanLines = workspaceCode.split('\n');
      
      // 统计在标记行之前有多少个实际的代码行（不包括标记行本身）
      // 这是最准确的方法，因为它直接反映了代码行的位置顺序
      let codeLineCountBefore = 0;
      for (let i = 0; i < markerLine; i++) {
        const line = codeLines[i]?.trim();
        // 只统计非空且不是标记行的代码行
        if (line && !line.startsWith('# block_id:')) {
          codeLineCountBefore++;
        }
      }
      
      // 获取标记行对应的代码行内容（标记行的下一行）
      let targetCodeContent = '';
      if (markerLine + 1 < codeLines.length) {
        targetCodeContent = codeLines[markerLine + 1]?.trim() || '';
      }
      
      if (targetCodeContent) {
        // 在干净代码中找到对应位置的代码行
        // 方法：找到第 codeLineCountBefore 个代码行，然后验证它是否匹配目标代码
        let currentCodeLineIndex = 0;
        let foundLine = -1;
        
        for (let i = 0; i < cleanLines.length; i++) {
          const cleanLine = cleanLines[i].trim();
          
          // 跳过空行
          if (!cleanLine) continue;
          
          // 如果这是第 codeLineCountBefore 个代码行
          if (currentCodeLineIndex === codeLineCountBefore) {
            // 验证这一行是否匹配目标代码
            if (cleanLine === targetCodeContent || 
                (targetCodeContent && cleanLine.includes(targetCodeContent)) ||
                (targetCodeContent && targetCodeContent.includes(cleanLine))) {
              foundLine = i;
              break;
            } else {
              // 如果位置匹配但内容不匹配，可能是代码结构有变化
              // 尝试通过内容匹配来找到正确的行
              break;
            }
          }
          
          currentCodeLineIndex++;
        }
        
        // 如果通过位置找到了匹配的行，使用它
        if (foundLine >= 0) {
          finalLine = foundLine;
          
          // 计算结束行：从开始行开始，向后查找对应数量的代码行
          // 注意：需要计算非空行的数量，但结束行应该包括所有行（包括空行）
          let nonEmptyLineCount = 0;
          let actualEndLine = foundLine;
          
          // 计算积木代码的非空行数（用于匹配）
          const blockCodeNonEmptyLines = blockCodeLines.filter(l => l.trim()).length;
          
          // 从开始行向后查找，直到找到足够的非空行
          for (let i = foundLine; i < cleanLines.length; i++) {
            const cleanLine = cleanLines[i].trim();
            if (cleanLine) {
              nonEmptyLineCount++;
              // 当找到足够的非空行时，确定结束行
              if (nonEmptyLineCount >= blockCodeNonEmptyLines) {
                actualEndLine = i;
                break;
              }
            }
            // 空行也算作一行，继续向后查找
            actualEndLine = i;
          }
          
          // 如果没找到足够的行，使用代码的最后一行
          finalEndLine = Math.min(actualEndLine, cleanLines.length - 1);
        } else {
          // 回退：如果位置匹配失败，使用内容匹配作为备选方案
          // 但这次我们仍然要考虑位置信息，优先选择接近预期位置的匹配
          let bestMatch = -1;
          let bestDistance = Infinity;
          
          for (let i = 0; i < cleanLines.length; i++) {
            const cleanLine = cleanLines[i].trim();
            if (!cleanLine) continue;
            
            // 检查是否匹配目标代码
            const isMatch = cleanLine === targetCodeContent || 
                           (targetCodeContent && cleanLine.includes(targetCodeContent)) ||
                           (targetCodeContent && targetCodeContent.includes(cleanLine));
            
            if (isMatch) {
              // 计算与预期位置的距离
              const distance = Math.abs(i - codeLineCountBefore);
              if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = i;
              }
            }
          }
          
          if (bestMatch >= 0) {
            finalLine = bestMatch;
            
            // 计算结束行：从开始行开始，向后查找对应数量的代码行
            let nonEmptyLineCount = 0;
            let actualEndLine = bestMatch;
            
            // 计算积木代码的非空行数（用于匹配）
            const blockCodeNonEmptyLines = blockCodeLines.filter(l => l.trim()).length;
            
            for (let i = bestMatch; i < cleanLines.length; i++) {
              const cleanLine = cleanLines[i].trim();
              if (cleanLine) {
                nonEmptyLineCount++;
                // 当找到足够的非空行时，确定结束行
                if (nonEmptyLineCount >= blockCodeNonEmptyLines) {
                  actualEndLine = i;
                  break;
                }
              }
              // 空行也算作一行，继续向后查找
              actualEndLine = i;
            }
            
            finalEndLine = Math.min(actualEndLine, cleanLines.length - 1);
            // console.log(`[highlight] Fallback: Found content match at line ${bestMatch + 1} (distance: ${bestDistance})`);
          }
          // else {
          //   console.warn(`[highlight] Could not find matching code for "${targetCodeContent.substring(0, 40)}"`);
          // }
        }
      }
      
      // 如果有后续积木，计算结束行号
      if (hasNextBlock && endMarkerLine >= 0 && endMarkerLine > markerLine) {
        const codeLines = codeWithMarker.split('\n');
        const cleanLines = workspaceCode.split('\n');
        
        // 统计在结束标记行之前有多少个实际的代码行
        let endCodeLineCountBefore = 0;
        for (let i = 0; i < endMarkerLine; i++) {
          const line = codeLines[i]?.trim();
          if (line && !line.startsWith('# block_id:')) {
            endCodeLineCountBefore++;
          }
        }
        
        // 获取结束标记行对应的代码行内容
        let endTargetCodeContent = '';
        if (endMarkerLine + 1 < codeLines.length) {
          endTargetCodeContent = codeLines[endMarkerLine + 1]?.trim() || '';
        }
        
        if (endTargetCodeContent) {
          // 找到结束标记行对应的代码行在干净代码中的位置
          let currentCodeLineIndex = 0;
          let foundEndLine = -1;
          
          for (let i = 0; i < cleanLines.length; i++) {
            const cleanLine = cleanLines[i].trim();
            if (!cleanLine) continue;
            
            if (currentCodeLineIndex === endCodeLineCountBefore) {
              if (cleanLine === endTargetCodeContent || 
                  (endTargetCodeContent && cleanLine.includes(endTargetCodeContent)) ||
                  (endTargetCodeContent && endTargetCodeContent.includes(cleanLine))) {
                foundEndLine = i;
                break;
              } else {
                break;
              }
            }
            
            currentCodeLineIndex++;
          }
          
          if (foundEndLine >= 0) {
            finalEndLine = foundEndLine;
          } else {
            // 回退：使用内容匹配
            let bestMatch = -1;
            let bestDistance = Infinity;
            
            for (let i = 0; i < cleanLines.length; i++) {
              const cleanLine = cleanLines[i].trim();
              if (!cleanLine) continue;
              
              const isMatch = cleanLine === endTargetCodeContent || 
                             (endTargetCodeContent && cleanLine.includes(endTargetCodeContent)) ||
                             (endTargetCodeContent && endTargetCodeContent.includes(cleanLine));
              
              if (isMatch) {
                const distance = Math.abs(i - endCodeLineCountBefore);
                if (distance < bestDistance) {
                  bestDistance = distance;
                  bestMatch = i;
                }
              }
            }
            
            if (bestMatch >= 0) {
              finalEndLine = bestMatch;
            }
          }
          
          // 如果找到了结束行，需要找到该积木代码的最后一行
          if (finalEndLine >= 0) {
            const lastBlockCode = normalize(Blockly.Python.blockToCode(lastBlock));
            const lastBlockCodeLines = lastBlockCode.split('\n').filter(l => l.trim());
            // 计算最后一个积木占用的非空行数
            const lastBlockLineCount = lastBlockCodeLines.length;
            
            // 在干净代码中，从最后一个积木的第一行开始，向后查找对应数量的非空行
            let nonEmptyLineCount = 0;
            let actualEndLine = finalEndLine;
            
            for (let i = finalEndLine; i < cleanLines.length; i++) {
              const cleanLine = cleanLines[i].trim();
              if (cleanLine) {
                nonEmptyLineCount++;
                if (nonEmptyLineCount >= lastBlockLineCount) {
                  actualEndLine = i;
                  break;
                }
              } else {
                // 空行也算作一行，继续向后查找
                actualEndLine = i;
              }
            }
            
            // 如果没找到足够的行，使用代码的最后一行
            finalEndLine = Math.min(actualEndLine, cleanLines.length - 1);
          }
        }
      }
    }

    // 调用成功回调
    if (typeof onSuccess === 'function') {
      // 如果没有后续积木，且找到了开始行但还没有结束行，需要计算结束行
      if (!hasNextBlock && finalLine >= 0 && finalEndLine < 0) {
        const cleanLines = workspaceCode.split('\n');
        const blockCodeNonEmptyLines = blockCodeLines.filter(l => l.trim()).length;
        
        if (blockCodeNonEmptyLines > 0) {
          let nonEmptyLineCount = 0;
          let actualEndLine = finalLine;
          
          // 从开始行向后查找，直到找到足够的非空行
          for (let i = finalLine; i < cleanLines.length; i++) {
            const cleanLine = cleanLines[i].trim();
            if (cleanLine) {
              nonEmptyLineCount++;
              // 当找到足够的非空行时，确定结束行
              if (nonEmptyLineCount >= blockCodeNonEmptyLines) {
                actualEndLine = i;
                break;
              }
            }
            // 空行也算作一行，继续向后查找
            actualEndLine = i;
          }
          
          finalEndLine = Math.min(actualEndLine, cleanLines.length - 1);
        } else {
          // 如果积木代码为空，使用开始行（单行高亮）
          finalEndLine = finalLine;
        }
      }
      
      onSuccess({
        blockCode,
        workspaceCode,
        startLine: finalLine,
        endLine: finalEndLine >= 0 ? finalEndLine : finalLine // 如果没有结束行，使用开始行（单行高亮）
      });
    }

    return true;
  } catch (e) {
    console.error('[highlight] blockToCode error', e);
    
    // 调用错误回调
    if (typeof onError === 'function') {
      onError(e);
    }
    
    return false;
  }
}

/**
 * 创建积木点击监听器（返回可直接用于 addChangeListener 的函数）
 * @param {Object} workspace - Blockly workspace 实例
 * @param {Function} onSuccess - 成功回调函数
 * @param {Function} onError - 错误回调函数（可选）
 * @returns {Function} 事件监听器函数
 */
export function createBlockClickListener(workspace, onSuccess, onError) {
  return (event) => {
    handleBlockClick(event, workspace, onSuccess, onError);
  };
}


