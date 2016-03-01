**zorg dat je een excel hebt klaar staan, waarin de gemeentecodes oplopend instaan. 

DATASET ACTIVATE DataSet1.
USE ALL.
COMPUTE filter_$=(Lftcat = 0).
VARIABLE LABELS filter_$ 'Lftcat = 0 (FILTER)'.
VALUE LABELS filter_$ 0 'Not Selected' 1 'Selected'.
FORMATS filter_$ (f1.0).
FILTER BY filter_$.
EXECUTE.

USE ALL.
COMPUTE filter_$=(Lftcat = 0 AND Geslacht= 0).
VARIABLE LABELS filter_$ 'Lftcat = 0 AND Geslacht= 0 (FILTER)'.
VALUE LABELS filter_$ 0 'Not Selected' 1 'Selected'.
FORMATS filter_$ (f1.0).
FILTER BY filter_$.
EXECUTE.

* Custom Tables.
CTABLES
  /VLABELS VARIABLES=Regio ind grond N_Ultimo DISPLAY=LABEL
  /TABLE Regio [C] BY ind [C] > grond [C] > N_Ultimo [S][SUM]
  /CATEGORIES VARIABLES=Regio ORDER=A KEY=VALUE EMPTY=EXCLUDE
  /CATEGORIES VARIABLES=ind grond ORDER=A KEY=VALUE EMPTY=INCLUDE.

USE ALL.
COMPUTE filter_$=(Geslacht = 0).
VARIABLE LABELS filter_$ 'Geslacht = 0 (FILTER)'.
VALUE LABELS filter_$ 0 'Not Selected' 1 'Selected'.
FORMATS filter_$ (f1.0).
FILTER BY filter_$.
EXECUTE.



* Custom Tables.
CTABLES
  /VLABELS VARIABLES=Regio Lftcat N_Ultimo DISPLAY=LABEL
  /TABLE Regio [C] BY Lftcat > N_Ultimo [S][SUM]
  /CATEGORIES VARIABLES=Regio ORDER=A KEY=VALUE EMPTY=EXCLUDE
  /CATEGORIES VARIABLES=Lftcat ORDER=A KEY=VALUE EMPTY=INCLUDE.

USE ALL.
COMPUTE filter_$=(Lftcat = 0).
VARIABLE LABELS filter_$ 'Lftcat = 0 (FILTER)'.
VALUE LABELS filter_$ 0 'Not Selected' 1 'Selected'.
FORMATS filter_$ (f1.0).
FILTER BY filter_$.
EXECUTE.

* Custom Tables.
CTABLES
  /VLABELS VARIABLES=Regio ind grond Geslacht N_Ultimo DISPLAY=LABEL
  /TABLE Regio [C] BY ind > grond [C] > Geslacht [C] > N_Ultimo [S][SUM]
  /CATEGORIES VARIABLES=Regio ORDER=A KEY=VALUE EMPTY=EXCLUDE
  /CATEGORIES VARIABLES=ind grond Geslacht ORDER=A KEY=VALUE EMPTY=INCLUDE.




DATASET ACTIVATE DataSet1.
USE ALL.
COMPUTE filter_$=(Lftcat = 0 AND grond = 0 AND Geslacht = 0).
VARIABLE LABELS filter_$ 'Lftcat = 0 AND grond = 0 AND Geslacht = 0 (FILTER)'.
VALUE LABELS filter_$ 0 'Not Selected' 1 'Selected'.
FORMATS filter_$ (f1.0).
FILTER BY filter_$.
EXECUTE.

* Custom Tables.
CTABLES
  /VLABELS VARIABLES=Regio pct_ultimo DISPLAY=LABEL
  /TABLE Regio BY pct_ultimo [SUM]
  /CATEGORIES VARIABLES=Regio ORDER=A KEY=VALUE EMPTY=EXCLUDE.
