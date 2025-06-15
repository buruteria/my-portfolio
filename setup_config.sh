#!/bin/bash
#============================================================
# setup_config.sh.example
# ─ ワークスペース構築スクリプト用のコンフィグファイル例
#
# 使い方: cp setup_config.sh.example setup_config.sh
#         編集後、./setup_workspace_simple.sh [path] setup_config.sh を実行
#============================================================

# 自動確認をスキップする（trueに設定すると確認なしで進行）
AUTO_APPROVE=false

# リポジトリを自動クローンする（trueに設定すると確認なしでクローン）
AUTO_CLONE=false

# ルート
# 形式: "GitリポジトリURL|ターゲットパス"
RULE_REPOS=(
  "https://github.com/miyatti777/rules_basic_public.git|.cursor/rules/basic"
  # 必要に応じて追加 （追加するときはカンマなどで区切らず、改行のみでOK）
  # "https://github.com/username/custom_rules.git|.cursor/rules/custom"
)

# スクリプトリポジトリ
SCRIPT_REPOS=(
  "https://github.com/miyatti777/scripts_public.git|scripts"
  # 必要に応じて追加 （追加するときはカンマなどで区切らず、改行のみでOK）
  # "https://github.com/username/custom_scripts.git|scripts/custom"
)

# プログラムリポジトリ
PROGRAM_REPOS=(
  "https://github.com/miyatti777/sample_pj_curry.git|Stock/programs/夕食作り"
  # 必要に応じて追加 （追加するときはカンマなどで区切らず、改行のみでOK）
  # "https://github.com/username/custom_program.git|Stock/programs/CUSTOM"
)


# 基本ディレクトリ構造
BASE_DIRS=(
  "Flow"
  "Stock"
  "Archived"
  "Archived/projects"
  "scripts"
  ".cursor/rules"
  ".cursor/rules/basic"
  "Stock/programs"
  # 必要に応じて追加
) 