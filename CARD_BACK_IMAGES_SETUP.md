# 卡牌背面图片设置说明

## 概述
游戏现在支持根据难度等级显示不同的卡牌背面图案。每个难度等级都有对应的卡牌背面图片。

## 当前状态
目前使用fallback显示方案，卡牌背面会显示：
- 基于难度等级的颜色背景
- "?"符号和难度等级文字（如"EASY", "MEDIUM"等）

当您添加实际的图片文件后，系统会自动切换到图片显示模式。

## 图片下载
请从以下URL下载对应的图片文件，并保存到 `assets/images/card-backs/` 目录中：

### Easy 难度 (绿色)
- **文件名**: `easy.png`
- **下载地址**: https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/easy.png
- **用途**: 关卡1-5的卡牌背面

### Medium 难度 (蓝色)
- **文件名**: `medium.png`
- **下载地址**: https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/medium.png
- **用途**: 关卡6-10的卡牌背面

### Hard 难度 (黄色)
- **文件名**: `hard.png`
- **下载地址**: https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/hard.png
- **用途**: 关卡11-15的卡牌背面

### Very Hard 难度 (橙色)
- **文件名**: `veryHard.png`
- **下载地址**: https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/veryHard.png
- **用途**: 关卡16-20的卡牌背面

### Extreme 难度 (红色)
- **文件名**: `extreme.png`
- **下载地址**: https://dzdbhsix5ppsc.cloudfront.net/monster/tinified/extreme.png
- **用途**: 关卡21-25的卡牌背面

## 文件结构
```
assets/images/card-backs/
├── easy.png
├── medium.png
├── hard.png
├── veryHard.png
└── extreme.png
```

## 技术实现
- 使用 `constants/cardBacks.js` 配置文件管理图片映射
- `GameCard` 组件支持显示图片作为卡牌背面
- 根据关卡难度自动选择对应的卡牌背面图案
- 如果图片加载失败，会显示默认的问号图案

## 注意事项
1. 请确保图片文件格式为PNG
2. 图片会使用 `resizeMode="cover"` 进行缩放以适应卡牌大小
3. 建议图片尺寸为正方形，以确保在不同卡牌尺寸下都能正常显示
4. 当前目录中的文件是占位符，需要替换为实际的图片文件
