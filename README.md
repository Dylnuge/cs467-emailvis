# CS467 Team 16 Email Visualization #

## Required Software ##
- [Python v2.7.6][py]
- [Tornado v3.1.1][py-tornado]

## Supplementary Software ##
- [D3 v3][d3]
- [Twitter Bootstrap v3.0][bootstrap]

## Installation Instructions ##
There are two ways to install all the required dependencies for this
visualization:

- Manually through the use of a package manager (e.g. apt-get).
    - Run the command `sudo apt-get install python`.
    - Run the comment `sudo apt-get install python-tornado`.
- Automatically through the use of the Python installation tool[pip][].
    - Run the command `pip install -r .requirements.txt` from the
      base directory of the visualization source.

## Running Instructions ##
Once all the proper dependencies are installed, the visualization can
be viewed by running the command `make` from the base directory of the
visualization source and opening a web browser to the address 
[localhost:9999][localhost].

## Credits ##
Source code for the email visualization assignment for CS467 (Social 
Visualization) at the University of Illinois Urbana Champaign.

### Authors ###
- Dylan Nugent (nugent5)
- Stavan Patel (patel145)
- Matthew Zettinger (zetting1)
- Lavanya Iyer (iyer6)
- Joseph Ciurej (ciurej2)

[py]: http://www.python.org/download/releases/2.7.6/ 
[pip]: http://www.tornadoweb.org/en/stable/
[py-tornado]: http://www.tornadoweb.org/en/stable/
[d3]: http://d3js.org/
[bootstrap]: http://getbootstrap.com/
[localhost]: http://localhost:9999
