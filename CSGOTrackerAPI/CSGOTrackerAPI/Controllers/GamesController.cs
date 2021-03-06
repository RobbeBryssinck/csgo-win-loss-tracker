﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CSGOTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using CSGOTrackerAPI.Authentication;
using Microsoft.AspNetCore.Identity;

namespace CSGOTrackerAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly GameContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public GamesController(GameContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameDTO>>> GetGames()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            return await _context.Games.Where(x => x.UserId == user.Id).Select(x => GameToDTO(x)).ToListAsync();
        }

        // GET: api/Games/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameDTO>> GetGame(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var game = _context.Games.Where(x => x.UserId == user.Id && x.Id == id).FirstOrDefault();

            if (game == null)
            {
                return NotFound();
            }

            return GameToDTO(game);
        }

        // PUT: api/Games/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        // TODO: Games PUT isn't implemented for this application yet
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame(int id, GameDTO gameDTO)
        {
            if (id != gameDTO.Id)
            {
                return BadRequest();
            }

            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            game.Rank = gameDTO.Rank;
            game.WinLoss = gameDTO.WinLoss;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!GameExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Games
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<GameDTO>> PostGame(GameDTO gameDTO)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var game = new Game
            {
                UserId = user.Id,
                Rank = gameDTO.Rank,
                WinLoss = gameDTO.WinLoss
            };

            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGame), new { id = gameDTO.Id }, GameToDTO(game));
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGame(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }
            if (game.UserId != user.Id)
            {
                return Unauthorized();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameExists(int id)
        {
            return _context.Games.Any(e => e.Id == id);
        }

        private static GameDTO GameToDTO(Game game) =>
            new GameDTO
            {
                Id = game.Id,
                Rank = game.Rank,
                WinLoss = game.WinLoss
            };
    }
}
