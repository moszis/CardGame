SELECT card_id, GROUP_CONCAT(ability_id) as abilityList 
FROM card_abilities  
where card_id in 
                 (Select distinct(c.card_id) 
                 FROM cards c 
                 JOIN player_cards pc
                 ON c.card_id = pc.card_id
				 JOIN card_abilities ca
				 ON ca.card_id = c.card_id
                 JOIN deck_cards dc
                 ON dc.player_card_rel_id = pc.player_card_rel_id
                 WHERE dc.deck_id = 1
)
GROUP BY card_id; 
