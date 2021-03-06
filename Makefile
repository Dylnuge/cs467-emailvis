COMPILER = python
INTERPRETER = python
COMPILER_FLAGS = 
TEST_FLAGS = -m unittest

SRC_DIR = ./src
LIB_DIR = ./lib
TEST_DIR = ./test
MAIN_SCRIPT = $(SRC_DIR)/server.py

.PHONY : clean

all : server

server : $(MAIN_SCRIPT) $(wildcard $(SRC_DIR)/*.py) $(wildcard $(LIB_DIR)/*.py)
	$(INTERPRETER) $(COMPILER_FLAGS) $(MAIN_SCRIPT)

tests : $(wildcard $(SRC_DIR)/*.py) $(wildcard $(TEST_DIR)/*.py)
	$(INTERPRETER) $(TEST_FLAGS) discover -s $(TEST_DIR) -p '*Test.py'

%Test : $(TEST_DIR)/%Test.py $(SRC_DIR)/%.py
	$(INTERPRETER) $(TEST_FLAGS) discover -s $(TEST_DIR) -p '$@.py'

clean :
	-rm -rf $(SRC_DIR)/*.pyc $(LIB_DIR)/*.pyc $(TEST_DIR)/*.pyc
