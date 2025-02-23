SELECT 
    i.id, 
    i.name, 
    i.unit, 
    i.division_id, 
    i.sub_division_id, 
    COALESCE(json_agg(DISTINCT a.allergy) FILTER (WHERE a.allergy IS NOT NULL), '[]') AS allergies,
    COALESCE(json_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL), '[]') AS dietary_tags
FROM ingredients i
LEFT JOIN ingredient_allergies ia ON i.id = ia.ingredient_id
LEFT JOIN allergies a ON ia.allergy_id = a.id
LEFT JOIN ingredient_tags it ON i.id = it.ingredient_id
LEFT JOIN tags t ON it.tag_id = t.id
GROUP BY i.id;