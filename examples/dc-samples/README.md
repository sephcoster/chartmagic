dc-samples
==========

Basic dc.js graphic meant to demonstrate how it can be used.  

## Running a Local Version
On a Mac - clone into the repository and run a simple python HTTP server (or your preferred server)
`python -m SimpleHTTPServer`

Next, navigate in a browser to 127.0.0.1:8000 or localhost:8000.  Next, click the "Foreign Assistance" directory.

Click "Index.html" to open the file we will be editing.

## Troubleshooting
When opening your local web server, open a console and ensure you are not receiving a 404 error on any included JavaScript files.

If you are not seeing files in your `lib` directory, make sure you are running a web server in the top-level dc-samples directory and not in the foreign assistance directory.  Foreign Assitance is a level down from all required included files.

If you want to see what the final product will look like, change the filename foreignassistance.js to foreignassistancefinal.js.  You should see multiple graphs on the page.  If you see those graphs successfully, change the name back, and resume the tutorial. You're all set!