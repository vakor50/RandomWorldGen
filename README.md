# To do:



----
## World Map
> Built using d3 and canvas manipulation.

Looking into two main implementation approaches

### Random Generation
- Use Voronoi polygons to create polygons on the map.
	- Shift polygons by re-running Voronoi on the centroid of each polygon. 
- Use set of random points in Perlin noise function (or other function) to generate height-map
	- Points chosen from polygon centers? Or
	- Points chosen from new random points
- Polygons that contain points above a certain threshold become land, hills, mountains, etc. and the below the threshold is water.
- (Optionally) Smooth the world by converting water tiles with all adjacent land tiles to land

### Plate Tectonics (to be implemented)
Use plate tectonics to grow the world from pangea **OR** apply heightmap to existing land/water world based on random plates

#### Grow the world

- Use Voronoi polygons to create polygons on the map.
	- Shift polygons by re-running Voronoi on the centroid of each polygon. 
- Create random clusters of adjacent polygons such that each cluster represents a **tectonic plate**
	- Plates need to be given a random vector to show rate and direction of movement
- Create a separate layer from the plates that creates a Pangaea-esque large land-mass, marking polygons as **land or water**
- Using polygon status as land/water and the plate movements, identify polygons that occur at the different plate interactions:
 1. **Ocean =><= Ocean**. Trenches, mountains, volcanoes, islands, earthquakes.
 2. **Ocean =><= Land**. Trenches, mountains, volcanoes, earthquakes.
 3. **Land =><= Land**. Trenches, mountains, volcanoes, islands.
 4. **Ocean <==> Ocean**. Ridge, rift valley, volcanic islands.
 5. **Ocean <==> Land**. Ridge, rift valley, volcanic islands.
 6. **Land <==> Land**. Earthquakes, rift valley, volcanoes.
 7. **Ocean ^/v Ocean**. Earthquakes.
 8. **Ocean ^/v Land**. Earthquakes.
 9. **Land ^/v Land**. Earthquakes.
- Create a function that uses the trajectory of adjacent plates to determine the height of border polygons (decrease or increase based on velocity vector)

##### Plate information
- polygons inside it
- speed of movement
- direction of movement

##### Landmass information
- polygons inside it

##### Polygon information
- coordinates of center
- coordinates of corner points
- coordinates of center of adjacent points (may eventually change to be array of adjacent polygon objects)
- which tectonic plate it belongs to
- whether it is land or water
- height of polygon

----
## World Politics

#### Not updated to reflect implementation of world map (yet)

- Create a random number of continents (eventually turn into number of landmass clusters from above)
- Create a random number of nations within each continent 
	- Assign a random D&D race.
	- Assign a random type of government
	- Assign a year of founding
	- Get population based on population of settlements
- Create a random number of settlements for each nation
	- Assign a population
	- Assign a city descriptor based on population (i.e. Village, Small Town, Large City, Metropolis, etc.)

#### Future goals
- Names
	- Continents incorporate something from contained nations
	- Nations and settlements generated based on D&D race
- Government
	- Assign D&D races types of government depending on whether they are monsterous or humanoid
	- Laws
- Diversify races of each nation based on some parameter
	- Neighboring nation types?
	- Races of that continent? 
	- Other continents if coastal nation?
- Give more detail on a nation
	- Name of ruler (individual or group)
	- Factions
		- Type (Religious, Anarchist, Militant, etc.)
		- Goals
		- Beliefs
		- Leaders
		- Examples
			- Cults, thieves, merchants, lords
	- Resources
		- Lumber, metal, etc.
	- Religion
		- Structure
		- Place of worship
		- Symbolism
		- Deities
		- Followers
		- Hertical?
	- Magic
		- Prevalence
		- Styles
		- Role in society
	- Perception of outsiders
		- Isolationist, Expansionist, Xenophobic, 
	- Cultural Appearance
	- Weaponry and armor
- Transform nations over time through randomly generated world history
	- Wars
	- Coups
	- Changes in government


-----
##### Future Directions List
- ML Flag generation
