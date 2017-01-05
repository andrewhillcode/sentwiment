# sentwiment
Twitter Stream + Sentiment Analysis - Uni project (2016 Semester 2)

My second node.js project. 
This was split into two files. App.js is the web server that handles new connections and the data stream. Process.js is intended to be run on a AWS EC2 scaling group that adds more severs as load increases (i.e. search terms that are generating more hits (trump, election, clinton) vs terms that won't be said often.)
