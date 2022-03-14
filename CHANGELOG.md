# Sierra Release Notes

## Beta 3.0 (December 22, 2021)

**Rule tables**

- Various types of tables are supported, so an end-user can: 
  - View the values in a table
  - Modify the values in a table
  - Add or delete rows and/or columns
  - Sort table contents based on the values in one column, in increasing or decreasing order
- Complex tables, such as the ones required to manage crew connection times and layover times, are now supported

**Rule descriptions**

- A "minimal" rule set for Jazz is available
- In beta3.0, this rule set includes: 
  - Jazz-specific company rules (initial incomplete set)
  - Generic rules required by Jazz (initial incomplete set)

**Integration with Altitude Pairing solver**

- The solver component in Altitude Pairing is reused in the Sierra framework to:
  - Execute solver requests
    - The solver returns pairings and solution statistics on successful completion
  - Perform some dynamic calculations, such as joining activities to create a pairing
    - The join operation includes the calculation of the pairing name, according to the convention currently used by Jazz 
  - Evaluate the legality of pairings 

**Actions on pairings and flights**

- The following actions on pairings and flights are supported: 
  - Select multiple pairings
  - Lock/unlock a pairing
  - View and/or change the crew composition of one or more pairings
  - View and add/remove tags on one or more pairings
  - Break one or more pairings into separate flights
  - Join two or more flights to create a pairing
  - Join flights and pairings
  - Join pairings
  - View operating flights as internal deadheads
  - View internal deadheads as operating flights

**User Interface enhancements**

- The following enhancements have been made to improve useability: 
  - Revamped the Main navigation (“hamburger”) menu
  - Redesigned activity tooltips to support more information, enhance readability, and pave the way for future reuse in Rostering and tracking contexts
  - Added a new tooltip for co-terminal transports
  - Added keyboard shortcuts in all dialogs 
  - Standardized capitalization and punctuation 
  - Added alerts information to the Pairing Details report
  - Redesigned the user info drop-down menu in the top-right of the screen 
  - Hid the "Add extra times" field in the Add/Edit side sheets for Accommodations, since this feature is not yet supported by the solver 

**Filter enhancements**

- The following new timeline filter criteria were added to display: 
  - All operating flights (for the current crew group)
  - All pairings (for the current crew group)
  - Pairings that contain deadheads
  - Deadhead flights (internal, commercial)
- The following feature was added to the filter side sheet:
  - Recall the criteria and settings of the last applied filter

**Migration to CORE services version 2.0**

- All Middle Layer (ML) to core APIs now call the associated v2.0 CORE counterparts

