#DistoNY : A new way to look at your State
##Introduction
Before making any important decision in our lives, we need to study the related statistics and the data. If you want to buy a new home in a new town, you would like to know the property rates, crime rates, education, etc. of the neighborhoods. If you want to make a new public policy, you would like to study affected areas from different statistical perspectives. Therefore, data plays a very crucial role in making any important decision. But it's very tiresome to go through the data in excel files. A good data visualization can make your life a lot simpler and interesting. Therefore, the main goal of our project is to develop a more intuitive data visualization tool for our society that can be used by the citizens, as well as by the policy makers.

#Time Series Visualization
Time Series relational visualization of various parameters of New York State government data. It presents the comparison of data of various counties and their change during a time interval. It shows the dynamic fluctuation in Education (x), Poverty (y) and Health (radius) of New York State Counties over the last 20 years. Counties are colored by geographic region; mouseover to read their names.

IDEA: To enable the users to not only view the various parametric data which influence daily lives of people but also a comparison among counties and how they have grown over the years. To show how various countries have developed since 1980.

CORE CONCEPTS: The graphical circles (nodes that represent various Counties) that can be dragged and will indirectly update the visualization. Focus: the visual element that is being dragged (can be a simplified simplified such as into a point or shadow). Trajectory: the visual path along which the Counties circles can be dragged. It is represented as a line. Data points: series of points the focus can reach on the trajectory.

##Distorted Map Visualization
When we look at the map of the Erie county, all we see are the towns and cities divided by their boundaries. A physical map just gives us a geographic picture of a place. What if maps could depict every possible statistic, instead of just showing the geographical areas? We developed a tool called DistoNY, that can distort any kind of map and can show different kinds of data within the maps while preserving the topology of the original map. Suppose we want our maps to show which city is the most densely populated in Erie county. If we feed the population density data into DistoNY, it will distort the Erie county map and change the areas of the cities/towns according to their density. That is, the city with the highest population density will have the highest area. It not only gives different perspectives to look at the different cities, it also gives a unique experience of maps with arbitrary data.

When we read data from the excel files, it's hard to relate them according to their geographical locations. Like for example, the public safety department of Buffalo wants to increase their police force in the areas which has a higher crime rate. When they read the crime rate data in the tables or bar charts or pie charts, they can only see the name of the neighborhood and their corresponding crime rates. But if they use the DistoNY and feed in the crime rate data, they can study the crime scenario in the map itself. Suppose the west region of the county has unexpectedly high crime rate compared to the other regions, then the resulted map in DistoNY will enlarge the cities in west region and can help the officials to decide which region should be their main focus. Therefore, instead of looking the data in different charts and then relating them on the maps, we can use DistoNY and view that statistic in a single step.

Last but not the least, the major advantage of using maps to view data is the photographic impression they can make. Maps can unarguably give a long lasting memory, as compared to tables and charts. Let's take an example of Matt, who is a kid in 4th grade. Matt wants to study what counties of the NY state have the most population density and which ones have the least. If you give him this information in a tabular form, he will take a lot of time in remembering these facts. But if you show him the facts on the map using DistoNY, he will have a long lasting impression of these facts. Suppose two corners of the map generated from DistoNY are very large and the other two are very tiny. So in the future, even if he forgets the exact name of the counties and their corresponding densities, he'll have a rough estimate of the parts which are more densely populated.

##Major Impact
DistoNY gives a very interesting approach to looking into the maps and can help the citizens, government and students to have the best out of the data they have and can certainly play a key role in making important decisions.

##Challenges Faced
The aim of our project is to visualize as much data as possible. But we faced major issues in integrating fragmented datasets and constructing a consistent visualization tool. Apart from dataset issues, we spent a lot of time in understanding how image visualization and image distortion works. After learning that, we started working on map distortion and we realized that distorting a map while preserving the map's topology is a very challenging task. We wanted counties and cities to be distorted based on the data, but at the same time, we had to maintain their interconnectivity. We spend a lot of time in coming with most effective algorithm to achieve the same.

##Technology Stack
Algorithm to distort the maps while preserving the topology of the original map: http://lambert.nico.free.fr/tp/biblio/Dougeniketal1985.pdf

JavaScript libraries to visualise data: D3.js, Topojson.js, cartogram.js, Colorbrewer.js and Dragit.js.

Python to parse the time-series data into the graph-ready json format.

ogr2ogr to convert shapefile(.shp) to Geojson format

Topojson to convert geojson to topojson format. Topojson is a compressed version of geojson and is much faster for rendering maps.

Backend is built on JavaScript and has been hosted on Parse Cloud.

Datasets: erie-county-demographics from BuffaloOpenData, https://data.gov, https://data.ny.gov/, https://gis2.erie.gov, https://gis.ny.gov

##What's next for DistoNY
We will continue adding more data and data visualization techniques into DistoNY and will keep improving the cartogram algorithm. We want to see DistoNY as a platform that that adapts the user's understanding of data and provide a personalized data visualization tool.

##Live Preview
=======================================================================
http://distony.parseapp.com
