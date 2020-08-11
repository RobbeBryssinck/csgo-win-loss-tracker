using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CSGOTrackerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using CSGOTrackerAPI.Authentication;

namespace CSGOTrackerAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RanksController : ControllerBase
    {
        private readonly GameContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public RanksController(GameContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        // GET: api/Ranks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rank>>> GetRanks()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            // TODO: tell the client to log out
            if (user == null)
            {
                return Unauthorized();
            }
            return await _context.Ranks.Where(x => x.UserId == user.Id).ToListAsync();
        }

        // GET: api/Ranks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Rank>> GetRank(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var rank = _context.Ranks.Where(x => x.UserId == user.Id && x.Id == id).FirstOrDefault();
            if (rank == null)
            {
                return NotFound();
            }

            return rank;
        }

        // PUT: api/Ranks/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRank(int id, RankDTO rankDTO)
        {
            if (id != rankDTO.Id)
            {
                return BadRequest();
            }

            var rank = await _context.Ranks.FindAsync(id);
            if (rank == null)
            {
                return NotFound();
            }

            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }
            if (rank.UserId != user.Id)
            {
                return Unauthorized();
            }

            rank.RankIndex = rankDTO.RankIndex;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!RankExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Ranks
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Rank>> PostRank(RankDTO rankDTO)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var rank = new Rank
            {
                UserId = user.Id,
                RankIndex = rankDTO.RankIndex
            };

            _context.Ranks.Add(rank);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRank), new { id = rankDTO.Id }, rankDTO);
        }

        // DELETE: api/Ranks/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Rank>> DeleteRank(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var rank = await _context.Ranks.FindAsync(id);
            if (rank == null)
            {
                return NotFound();
            }
            if (rank.UserId != user.Id)
            {
                return Unauthorized();
            }

            _context.Ranks.Remove(rank);
            await _context.SaveChangesAsync();

            return rank;
        }

        private bool RankExists(int id)
        {
            return _context.Ranks.Any(e => e.Id == id);
        }

        // TODO: RankToDTO()
    }
}
