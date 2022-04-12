.PHONY: contracts/NZCOVIDBadge.sol

DFLAGS=

all: contracts/NZCOVIDBadge.sol

contracts/NZCOVIDBadge.sol: templates/NZCOVIDBadge.sol
	rm -f $@
	cpp -P $(DFLAGS) $< > $@ 
