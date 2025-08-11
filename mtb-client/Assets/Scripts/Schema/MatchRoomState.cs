// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 3.0.52
// 

using Colyseus.Schema;

namespace MTB.Game.Schema 
{
	public partial class MatchRoomState : Colyseus.Schema.Schema 
	{
		public MatchRoomState()
		{
			
		}
		
		[Type(0, "map", typeof(MapSchema<Player>))]
		public MapSchema<Player> players = null;
	}
}
