.PHONY: contracts/NZCOVIDBadgeLive.sol contracts/NZCOVIDBadgeExample.sol

all: contracts/NZCOVIDBadgeLive.sol contracts/NZCOVIDBadgeExample.sol

contracts/NZCOVIDBadgeLive.sol: templates/NZCOVIDBadge.sol
	rm -f $@
	cpp -P -DLIVE $< > $@ 

contracts/NZCOVIDBadgeExample.sol: templates/NZCOVIDBadge.sol
	rm -f $@
	cpp -P $< > $@ 
