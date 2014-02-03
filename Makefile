VIEWER = firefox
VIEWER_FLAGS = 
INTERPRETER = python
INTERPRETER_FLAGS = 
TEST_FLAGS = -m unittest

SRC_DIR = ./src
LIB_DIR = ./lib
TEST_DIR = ./test
ASSET_DIR = ./asset
VIZ_DIR = $(SRC_DIR)/viz
SERVER_DIR = $(SRC_DIR)/server

VIZ_MAIN_PAGE = $(ASSET_DIR)/index.html
SERVER_MAIN_SCRIPT = $(SERVER_DIR)/main.py


.PHONY : clean

all : vizualization

visualization : $(VIZ_MAIN_PAGE) $(wildcard $(VIZ_DIR)/*.js) $(wildcard $(SERVER_DIR)/*.py)
	$(VIEWER) $(VIEWER_FLAGS) $(VIZ_MAIN_PAGE) &
	$(INTERPRETER) $(INTERPRETER_FLAGS) $(SERVER_MAIN_SCRIPT)

clean :
	-rm -rf $(SERVER_DIR)/*.pyc $(LIB_DIR)/*.pyc $(TEST_DIR)/*.pyc
